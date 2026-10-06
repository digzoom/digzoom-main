import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryResult } from './test-utils/mock-query';

const mocks = vi.hoisted(() => ({ from: vi.fn(), fetch: vi.fn() }));
vi.mock('../netlify/lib/supabase-admin', () => ({ getSupabaseAdmin: () => ({ from: mocks.from }) }));
import { syncMerchantPayment } from '../netlify/lib/merchant-ledger';

const order = {
  id: 'DZ-free-order', total_amount: 0, status: 'paid', paid_at: '2026-10-01T00:00:00Z',
  payment_payload: { checkout_session_id: 'cs_free_order', payment_status: 'no_payment_required', amount_total: 0, currency: 'sar', payment_intent_id: null },
};
beforeEach(() => { mocks.from.mockReset(); mocks.fetch.mockReset(); vi.stubGlobal('fetch', mocks.fetch); });
afterEach(() => vi.unstubAllGlobals());

describe('verified zero-total merchant orders', () => {
  it('records zero fees, commissions and proceeds without a Stripe API request', async () => {
    const update = queryResult(null);
    mocks.from.mockReturnValueOnce(queryResult([{ id: 'item-1', gross_cents: 0, status: 'fee_pending', settlement_id: null }]))
      .mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult({ hold_days: 7 })).mockReturnValueOnce(update);
    await syncMerchantPayment(order.id, null);
    expect(update.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'ready', stripe_fee_cents: 0, commission_cents: 0, merchant_cents: 0, ready_at: '2026-10-08T00:00:00.000Z' }));
    expect(update.is).toHaveBeenCalledWith('settlement_id', null);
    expect(update.neq).toHaveBeenCalledWith('status', 'held');
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each([
    { ...order, total_amount: 39 }, { ...order, status: 'refunded' }, { ...order, status: 'cancelled' },
    { ...order, paid_at: null }, { ...order, payment_payload: {} },
    { ...order, payment_payload: { ...order.payment_payload, payment_status: 'paid' } },
    { ...order, payment_payload: { ...order.payment_payload, currency: 'usd' } },
    { ...order, payment_payload: { ...order.payment_payload, payment_intent_id: 'pi_unexpected' } },
  ])('rejects missing or inconsistent zero-cost confirmation evidence: %j', async invalidOrder => {
    mocks.from.mockReturnValueOnce(queryResult([{ id: 'item-1', gross_cents: 0 }])).mockReturnValueOnce(queryResult(invalidOrder));
    await expect(syncMerchantPayment(order.id, null)).rejects.toThrow('Missing Stripe payment reference');
    expect(mocks.from).toHaveBeenCalledTimes(2);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('does not overwrite held or settled entries', async () => {
    mocks.from.mockReturnValueOnce(queryResult([{ id: 'held', gross_cents: 0, status: 'held' }, { id: 'settled', gross_cents: 0, settlement_id: 'settlement-1' }]))
      .mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult({ hold_days: 7 }));
    await syncMerchantPayment(order.id, null);
    expect(mocks.from).toHaveBeenCalledTimes(3);
  });

  it('rejects a nonzero merchant allocation for a free order', async () => {
    mocks.from.mockReturnValueOnce(queryResult([{ id: 'item-1', gross_cents: 1, status: 'pending' }]))
      .mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult({ hold_days: 7 }));
    await expect(syncMerchantPayment(order.id, null)).rejects.toThrow('Zero-total merchant amount mismatch');
  });
});
