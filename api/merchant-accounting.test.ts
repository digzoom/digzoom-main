import {describe,it,expect} from 'vitest';
import {allocateCents,commissionSplit,feeInSar,signReferral,verifyReferral} from '../netlify/lib/merchant-accounting';
describe('merchant cents ledger',()=>{
 it('conserves every cent across mixed-cart rounding',()=>{expect(allocateCents(101,[100,100,100])).toEqual([34,34,33]);expect(allocateCents(30,[0,100,200])).toEqual([0,10,20]);});
 it('allocates discounts and actual fees before commission',()=>{const gross=allocateCents(90000,[80000,20000]),fee=allocateCents(3500,[80000,20000]);expect(commissionSplit(gross[0],fee[0],15)).toEqual({commission:10380,merchant:58820});expect(commissionSplit(gross[1],fee[1],25)).toEqual({commission:4325,merchant:12975});expect(58820+10380+12975+4325+3500).toBe(90000);});
 it('fails closed for unknown fee FX and excess fees',()=>{expect(feeInSar({fee:100,currency:'usd',exchange_rate:.25})).toBe(400);expect(feeInSar({fee:100,currency:'usd'})).toBeNull();expect(feeInSar({fee:100,currency:'jpy',exchange_rate:40})).toBeNull();expect(()=>commissionSplit(100,101,15)).toThrow();});
 it('rejects forged and expired referral attribution',()=>{const token=signReferral('merchant-one','secret',1000);expect(verifyReferral(token,'secret',2000)).toBe('merchant-one');expect(verifyReferral(token,'wrong',2000)).toBeNull();expect(verifyReferral(token+'x','secret',2000)).toBeNull();expect(verifyReferral(token,'secret',1000+7*86400000)).toBeNull();});
});
