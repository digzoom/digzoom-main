import {beforeEach,describe,it,expect,vi} from 'vitest';
const mocks=vi.hoisted(()=>({user:undefined as any,from:vi.fn()}));
vi.mock('../netlify/lib/trpc',()=>({verifySupabaseToken:vi.fn(async()=>mocks.user)}));
vi.mock('../netlify/lib/supabase-admin',()=>({getSupabaseAdmin:()=>({from:mocks.from})}));
import {handler} from '../netlify/functions/merchant';
function request(action:string,values:Record<string,unknown>={}){return handler({httpMethod:'POST',headers:{authorization:'Bearer test'},body:JSON.stringify({action,...values})} as never,{} as never,()=>{}) as Promise<{statusCode:number}>;}
function builder(data:any){const q:any={};for(const method of ['select','eq','in','order','limit','update','insert','gte','is','not'])q[method]=vi.fn(()=>q);q.maybeSingle=vi.fn(async()=>({data,error:null}));q.single=q.maybeSingle;q.then=(resolve:any)=>resolve({data,error:null,count:0});return q;}
describe('verified merchant authorization',()=>{
 beforeEach(()=>{mocks.user=undefined;mocks.from.mockReset();});
 it('blocks unauthenticated writes',async()=>{expect((await request('save_offer')).statusCode).toBe(401);expect(mocks.from).not.toHaveBeenCalled();});
 it('blocks merchant use of all admin financial actions',async()=>{mocks.user={id:'user-one',role:'user'};for(const action of ['approve_application','publish_offer','approve_delivery','settle','sync_fees','settings'])expect((await request(action)).statusCode).toBe(403);expect(mocks.from).not.toHaveBeenCalled();});
 it('cannot deliver another merchants item using a forged merchant id',async()=>{mocks.user={id:'user-one',role:'user'};const merchant=builder({id:'a1000000-0000-4000-8000-000000000001',status:'active'}),item=builder(null);mocks.from.mockReturnValueOnce(merchant).mockReturnValueOnce(item);expect((await request('fulfill',{id:'b2000000-0000-4000-8000-000000000002',merchant_id:'victim',note:'fake fulfillment'})).statusCode).toBe(404);expect(item.eq).toHaveBeenCalledWith('merchant_id','a1000000-0000-4000-8000-000000000001');expect(item.update).not.toHaveBeenCalled();});
 it('suspended merchant cannot submit an offer',async()=>{mocks.user={id:'user-one',role:'user'};mocks.from.mockReturnValue(builder({id:'m',status:'suspended'}));expect((await request('save_offer')).statusCode).toBe(403);});
});

describe('seller delivery eligibility',()=>{
 beforeEach(()=>{mocks.user={id:'user-one',role:'user'};mocks.from.mockReset();});
 it.each(['cancelled','refunded','pending'])('blocks fulfillment for parent order status %s',async(status)=>{
  const merchant=builder({id:'a1000000-0000-4000-8000-000000000001',status:'active'}),item=builder({id:'b2000000-0000-4000-8000-000000000002',paid_at:'2026-10-01',status:'ready',delivered_at:null,settlement_id:null,orders:{status}});
  mocks.from.mockReturnValueOnce(merchant).mockReturnValueOnce(item);
  expect((await request('fulfill',{id:'b2000000-0000-4000-8000-000000000002',note:'Delivery proof for this order'})).statusCode).toBe(409);
  expect(item.update).not.toHaveBeenCalled();
 });
 it('blocks fulfillment once a settlement is attached',async()=>{
  const merchant=builder({id:'a1000000-0000-4000-8000-000000000001',status:'active'}),item=builder({id:'b2000000-0000-4000-8000-000000000002',paid_at:'2026-10-01',status:'ready',delivered_at:null,settlement_id:'settled',orders:{status:'paid'}});
  mocks.from.mockReturnValueOnce(merchant).mockReturnValueOnce(item);
  expect((await request('fulfill',{id:'b2000000-0000-4000-8000-000000000002',note:'Delivery proof for this order'})).statusCode).toBe(409);
  expect(item.update).not.toHaveBeenCalled();
 });
 it('allows proof submission for a paid order while fees are pending',async()=>{
  const merchant=builder({id:'a1000000-0000-4000-8000-000000000001',status:'active'}),item=builder({id:'b2000000-0000-4000-8000-000000000002',paid_at:'2026-10-01',status:'fee_pending',delivered_at:null,settlement_id:null,orders:{status:'paid'}}),write=builder(null);
  mocks.from.mockReturnValueOnce(merchant).mockReturnValueOnce(item).mockReturnValueOnce(write);
  expect((await request('fulfill',{id:'b2000000-0000-4000-8000-000000000002',note:'Delivery proof for this order'})).statusCode).toBe(200);
  expect(write.update).toHaveBeenCalled();
 });
 it('blocks administrator approval for revoked orders',async()=>{
  mocks.user={id:'admin',role:'admin'};const item=builder({paid_at:'2026-10-01',fulfillment_submitted_at:'2026-10-02',status:'ready',orders:{status:'cancelled'}});mocks.from.mockReturnValue(item);
  expect((await request('approve_delivery',{id:'b2000000-0000-4000-8000-000000000002'})).statusCode).toBe(400);
  expect(item.update).not.toHaveBeenCalled();
 });
});
