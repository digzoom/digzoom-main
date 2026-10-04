import {getSupabaseAdmin} from './supabase-admin';
import {previewFileType} from '../../src/data/partnerFiles';
export const PREVIEW_BUCKET='partner-previews';
export async function ownedPreviewAssets(ids:unknown,userId:string,required=true){
 if(!Array.isArray(ids)||ids.length>3||ids.some(id=>typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))||new Set(ids).size!==ids.length||(required&&!ids.length))throw new Error('ارفع ملف معاينة واحدًا على الأقل، وبحد أقصى 3 ملفات');
 if(!ids.length)return [];
 const db:any=getSupabaseAdmin();
 const {data,error}=await db.from('partner_preview_assets').select('*').in('id',ids).eq('user_id',userId).eq('status','uploaded');
 if(error||data?.length!==ids.length)throw new Error('ملفات المعاينة غير متاحة لهذا الحساب');
 return ids.map(id=>data.find((a:any)=>a.id===id));
}
export async function verifyUploadedAsset(asset:any){
 const db:any=getSupabaseAdmin(),{data,error}=await db.storage.from(PREVIEW_BUCKET).info(asset.storage_path);
 const size=data?.size??data?.metadata?.size,mime=data?.contentType??data?.metadata?.mimetype;
 if(error||size!==Number(asset.size_bytes)||mime!==asset.mime_type)throw new Error('الملف المرفوع لا يطابق البيانات');
 previewFileType(asset.name,Number(size));
 // Inspect only a small prefix; never execute or unpack preview files.
 const {data:signed,error:signError}=await db.storage.from(PREVIEW_BUCKET).createSignedUrl(asset.storage_path,60);
 if(signError||!signed?.signedUrl)throw new Error('تعذر التحقق من الملف');
 const response=await fetch(signed.signedUrl,{headers:{Range:'bytes=0-15'},signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('تعذر التحقق من الملف');
 const reader=response.body?.getReader(); if(!reader)throw new Error('الملف غير قابل للقراءة');
 const {value}=await reader.read();await reader.cancel();
 const bytes=Buffer.from(value||[]), ext=asset.storage_path.split('.').pop();
 const valid=asset.mime_type==='image/jpeg'?bytes[0]===255&&bytes[1]===216:
 asset.mime_type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):
 asset.mime_type==='image/webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':
 asset.mime_type==='application/pdf'?bytes.toString('ascii',0,5)==='%PDF-':
 asset.mime_type==='video/mp4'?bytes.toString('ascii',4,8)==='ftyp':
 asset.mime_type==='video/webm'?bytes.subarray(0,4).equals(Buffer.from([26,69,223,163])):
 ['zip','docx','xlsx','pptx','sketch'].includes(ext||'')?bytes[0]===80&&bytes[1]===75:true;
 if(!valid)throw new Error('محتوى الملف لا يطابق نوعه');
}
