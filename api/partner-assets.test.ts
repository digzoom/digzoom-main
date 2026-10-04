import {beforeEach,describe,it,expect,vi} from 'vitest';
const mock=vi.hoisted(()=>({info:vi.fn(),signed:vi.fn(),from:vi.fn()}));
vi.mock('../netlify/lib/supabase-admin',()=>({getSupabaseAdmin:()=>({from:mock.from,storage:{from:()=>({info:mock.info,createSignedUrl:mock.signed})}})}));
import {verifyUploadedAsset,ownedPreviewAssets} from '../netlify/lib/partner-assets';
const file={name:'sample.pdf',storage_path:'owner/sample.pdf',mime_type:'application/pdf',size_bytes:8};
describe('uploaded preview verification',()=>{
 beforeEach(()=>{mock.info.mockReset();mock.signed.mockReset();mock.from.mockReset();vi.restoreAllMocks();});
 it('verifies storage size, MIME and actual file signature before approval',async()=>{mock.info.mockResolvedValue({data:{size:8,contentType:'application/pdf'},error:null});mock.signed.mockResolvedValue({data:{signedUrl:'https://storage.test/signed'},error:null});const fetch=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(new TextEncoder().encode('%PDF-1.7')));await verifyUploadedAsset(file);expect(fetch).toHaveBeenCalledWith('https://storage.test/signed',expect.objectContaining({headers:{Range:'bytes=0-15'}}));});
 it('rejects fake PDF content',async()=>{mock.info.mockResolvedValue({data:{size:8,contentType:'application/pdf'},error:null});mock.signed.mockResolvedValue({data:{signedUrl:'https://storage.test/signed'},error:null});vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('bad file'));await expect(verifyUploadedAsset(file)).rejects.toThrow('محتوى');});
 it('rejects mismatched size without reading the file',async()=>{mock.info.mockResolvedValue({data:{size:99,contentType:'application/pdf'},error:null});await expect(verifyUploadedAsset(file)).rejects.toThrow('لا يطابق');expect(mock.signed).not.toHaveBeenCalled();});
 it('requires owned, completed attachments before linking to an offer',async()=>{const q:any={};for(const method of ['select','in','eq'])q[method]=vi.fn(()=>q);q.then=(resolve:any)=>resolve({data:[],error:null});mock.from.mockReturnValue(q);await expect(ownedPreviewAssets(['a1000000-0000-4000-8000-000000000001'],'owner')).rejects.toThrow('لهذا الحساب');expect(q.eq).toHaveBeenCalledWith('user_id','owner');expect(q.eq).toHaveBeenCalledWith('status','uploaded');});
});
