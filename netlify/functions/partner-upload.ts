import type {Handler} from '@netlify/functions';
import {randomUUID} from 'node:crypto';
import {getSupabaseAdmin} from '../lib/supabase-admin';
import {verifySupabaseToken} from '../lib/trpc';
import {PREVIEW_BUCKET,verifyUploadedAsset} from '../lib/partner-assets';
import {previewFileType} from '../../src/data/partnerFiles';
const reply=(statusCode:number,data:unknown)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(data)});
export const handler:Handler=async event=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'Method not allowed'});
 try{
 const token=(event.headers.authorization||'').replace(/^Bearer /,''),user=token?await verifySupabaseToken(token):undefined;
 if(!user?.email)return reply(401,{error:'سجّل الدخول لرفع الملفات'});
 if((event.body?.length||0)>2000)return reply(413,{error:'الطلب كبير'});
 const input=JSON.parse(event.body||'{}'),db:any=getSupabaseAdmin();
 if(input.action==='prepare'){
   const name=String(input.name||'').replace(/[\x00-\x1f<>]/g,'').slice(0,180),size=Number(input.size),{ext,mime}=previewFileType(name,size);
   const {data:recent,error}=await db.from('partner_preview_assets').select('size_bytes').eq('user_id',user.id).gte('created_at',new Date(Date.now()-86400000).toISOString());
   if(error)throw error;
   if(recent.length>=20||recent.reduce((n:number,a:any)=>n+Number(a.size_bytes),0)+size>100*1024*1024)return reply(429,{error:'وصلت للحد اليومي للرفع. حاول لاحقًا.'});
   const id=randomUUID(),path=`${user.id}/${id}.${ext}`;
   const {error:insertError}=await db.from('partner_preview_assets').insert({id,user_id:user.id,name,mime_type:mime,size_bytes:size,storage_path:path});if(insertError)throw insertError;
   const {data,error:uploadError}=await db.storage.from(PREVIEW_BUCKET).createSignedUploadUrl(path,{upsert:false});
   if(uploadError||!data?.token)throw new Error('تعذر بدء رفع الملف');
   return reply(200,{id,path,token:data.token,mime,bucket:PREVIEW_BUCKET});
 }
 if(!/^[a-f0-9-]{36}$/.test(String(input.id)))return reply(400,{error:'الملف غير صالح'});
 let query=db.from('partner_preview_assets').select('*').eq('id',input.id);
 if(user.role!=='admin'||input.action==='complete')query=query.eq('user_id',user.id);
 const {data:asset,error}=await query.maybeSingle();if(error)throw error;if(!asset)return reply(404,{error:'الملف غير موجود'});
 if(input.action==='complete'){
   await verifyUploadedAsset(asset);
   const {error:e}=await db.from('partner_preview_assets').update({status:'uploaded'}).eq('id',asset.id).eq('user_id',user.id);if(e)throw e;
   return reply(200,{id:asset.id,name:asset.name,mime_type:asset.mime_type,size_bytes:asset.size_bytes});
 }
 if(input.action==='preview'&&asset.status==='uploaded'){
   const inline=asset.mime_type.startsWith('image/')||asset.mime_type.startsWith('video/')||asset.mime_type==='application/pdf';
   const {data,error:e}=await db.storage.from(PREVIEW_BUCKET).createSignedUrl(asset.storage_path,300,inline?{}:{download:asset.name});
   if(e)throw e;return reply(200,{id:asset.id,name:asset.name,mime_type:asset.mime_type,size_bytes:asset.size_bytes,url:data.signedUrl});
 }
 return reply(400,{error:'الإجراء غير متاح'});
 }catch(error:any){console.error('[partner-upload]',error?.message);return reply(400,{error:typeof error?.message==='string'&&/[\u0600-\u06ff]/.test(error.message)?error.message:'تعذر رفع الملف؛ أعد المحاولة'});}
};
