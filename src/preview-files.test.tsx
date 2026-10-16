// @vitest-environment jsdom
import React,{act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import PreviewFiles from './components/partners/PreviewFiles';
const mock=vi.hoisted(()=>({upload:vi.fn()}));
vi.mock('@/lib/supabase',()=>({supabase:{storage:{from:()=>({uploadToSignedUrl:mock.upload})}}}));
let root:Root,host:HTMLDivElement;
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;mock.upload.mockReset().mockResolvedValue({error:null});vi.stubGlobal('fetch',vi.fn());vi.stubGlobal('URL',Object.assign(URL,{createObjectURL:vi.fn(()=> 'blob:test'),revokeObjectURL:vi.fn()}));});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.unstubAllGlobals();});
describe('preview upload workflow',()=>{
 it('shows a sign-in action instead of a dead file picker for visitors',async()=>{await act(async()=>root.render(<MemoryRouter><PreviewFiles value={[]} onChange={()=>{}} signInRequired ar/></MemoryRouter>));expect(host.querySelector('input[type=file]')).toBeNull();expect(host.querySelector('a')?.getAttribute('href')).toBe('/login');expect(host.textContent).toContain('سجّل الدخول أولًا');});
 it('keeps all selected files when clearing the native file picker',async()=>{
 const changed=vi.fn();const selected=[new File(['image'],'one.png',{type:'image/png'}),new File(['archive'],'two.zip',{type:'application/zip'})];
 let id=0;vi.mocked(fetch).mockImplementation(async(_url,init)=>{const body=JSON.parse(String(init?.body));if(body.action==='prepare')return new Response(JSON.stringify({id:String(++id),bucket:'partner-previews',path:body.name,token:'test',mime:body.name.endsWith('.png')?'image/png':'application/zip'}));return new Response(JSON.stringify({id:body.id,name:body.id==='1'?'one.png':'two.zip',mime_type:body.id==='1'?'image/png':'application/zip',size_bytes:5}));});
 await act(async()=>root.render(<MemoryRouter><PreviewFiles value={[]} onChange={changed}/></MemoryRouter>));
 const input=host.querySelector('input[type=file]') as HTMLInputElement;
 Object.defineProperty(input,'files',{get:()=>selected});Object.defineProperty(input,'value',{set:()=>{selected.length=0;},configurable:true});
 await act(async()=>{input.dispatchEvent(new Event('change',{bubbles:true}));});
 expect(selected).toHaveLength(0);expect(mock.upload).toHaveBeenCalledTimes(2);expect(changed.mock.calls.at(-1)?.[0].map((f:any)=>f.name)).toEqual(['one.png','two.zip']);expect(host.querySelector('[role=alert]')).toBeNull();
 });
 it('rejects unsupported files without starting upload',async()=>{await act(async()=>root.render(<MemoryRouter><PreviewFiles value={[]} onChange={()=>{}} ar/></MemoryRouter>));const input=host.querySelector('input[type=file]')!;Object.defineProperty(input,'files',{value:[new File(['bad'],'bad.exe')]});await act(async()=>{input.dispatchEvent(new Event('change',{bubbles:true}));});expect(mock.upload).not.toHaveBeenCalled();expect(host.querySelector('[role=alert]')).not.toBeNull();});
});
