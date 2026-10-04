import {beforeEach,describe,it,expect,vi} from 'vitest';
import {previewFileType,PREVIEW_MAX_BYTES} from '../src/data/partnerFiles';
const mock=vi.hoisted(()=>({user:undefined as any,from:vi.fn(),sign:vi.fn(),verify:vi.fn()}));
vi.mock('../netlify/lib/trpc',()=>({verifySupabaseToken:vi.fn(async()=>mock.user)}));
vi.mock('../netlify/lib/supabase-admin',()=>({getSupabaseAdmin:()=>({from:mock.from,storage:{from:()=>({createSignedUploadUrl:mock.sign})}})}));
vi.mock('../netlify/lib/partner-assets',()=>({PREVIEW_BUCKET:'partner-previews',verifyUploadedAsset:mock.verify}));
import {handler} from '../netlify/functions/partner-upload';
function chain(data:any){const q:any={};for(const m of ['select','eq','gte','insert','update'])q[m]=vi.fn(()=>q);q.maybeSingle=vi.fn(async()=>({data,error:null}));q.then=(resolve:any)=>resolve({data,error:null});return q;}
const call=(body:any)=>handler({httpMethod:'POST',headers:{authorization:'Bearer test'},body:JSON.stringify(body)} as any,{} as any,()=>{});
describe('private product preview uploads',()=>{
 beforeEach(()=>{mock.user=undefined;mock.from.mockReset();mock.sign.mockReset();mock.verify.mockReset();});
 it('supports photos, video, PDF books and templates without relying on browser MIME',()=>{for(const name of ['photo.JPG','sample.mp4','book.pdf','template.zip','slides.pptx','design.psd'])expect(previewFileType(name,100).mime).toBeTruthy();});
 it('rejects executable or active content and oversize files',()=>{for(const name of ['run.exe','index.html','script.js','image.svg','a.jpg.exe'])expect(()=>previewFileType(name,100)).toThrow();expect(()=>previewFileType('book.pdf',PREVIEW_MAX_BYTES+1)).toThrow();});
 it('requires verified sign-in',async()=>{expect((await call({action:'prepare',name:'book.pdf',size:100}) as any).statusCode).toBe(401);expect(mock.from).not.toHaveBeenCalled();});
 it('never trusts a submitted user id or file path',async()=>{mock.user={id:'verified-user',email:'owner@example.com',role:'user'};const recent=chain([]),insert=chain(null);mock.from.mockReturnValueOnce(recent).mockReturnValueOnce(insert);mock.sign.mockResolvedValue({data:{token:'signed-token'},error:null});const r:any=await call({action:'prepare',name:'template.zip',size:100,user_id:'victim',path:'victim/secret.zip'});expect(r.statusCode).toBe(200);expect(insert.insert.mock.calls[0][0].user_id).toBe('verified-user');expect(JSON.parse(r.body).path).toMatch(/^verified-user\/[a-f0-9-]+\.zip$/);expect(mock.sign).toHaveBeenCalledWith(expect.any(String),{upsert:false});});
 it('cannot preview another users file',async()=>{mock.user={id:'verified-user',email:'owner@example.com',role:'user'};const q=chain(null);mock.from.mockReturnValue(q);expect((await call({action:'preview',id:'a1000000-0000-4000-8000-000000000001'}) as any).statusCode).toBe(404);expect(q.eq).toHaveBeenCalledWith('user_id','verified-user');});
 it('unverified uploads cannot be linked as complete',async()=>{mock.user={id:'verified-user',email:'owner@example.com',role:'user'};const q=chain({id:'a1000000-0000-4000-8000-000000000001',status:'pending'});mock.from.mockReturnValue(q);mock.verify.mockRejectedValue(new Error('المحتوى غير صحيح'));expect((await call({action:'complete',id:'a1000000-0000-4000-8000-000000000001'}) as any).statusCode).toBe(400);expect(q.update).not.toHaveBeenCalled();});
});
