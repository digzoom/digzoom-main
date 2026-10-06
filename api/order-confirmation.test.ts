import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryResult } from './test-utils/mock-query';

const mocks = vi.hoisted(() => ({ from: vi.fn(), sync: vi.fn(), fetch: vi.fn() }));
vi.mock('../netlify/lib/supabase-admin', () => ({ getSupabaseAdmin: () => ({ from: mocks.from }) }));
vi.mock('../netlify/lib/merchant-ledger', () => ({ syncMerchantPayment: mocks.sync }));
import { confirmPaidOrder } from '../netlify/lib/order-confirmation';

const order = { id: 'DZ-order-test', total_amount: 39, status: 'pending', paid_at: null, coupon_id: null, payment_payload: { checkout_session_id: 'cs_test_order' } };
const paidSession = { id: 'cs_test_order', payment_status: 'paid', status: 'complete', amount_total: 3900, currency: 'sar', payment_intent: 'pi_test_order', metadata: { order_id: order.id } };
const freeSession = { ...paidSession, payment_status: 'no_payment_required', amount_total: 0, payment_intent: null };

beforeEach(() => {
  mocks.from.mockReset(); mocks.sync.mockReset(); mocks.fetch.mockReset();
  mocks.sync.mockResolvedValue(undefined);
  mocks.fetch.mockResolvedValue({ ok: true });
  vi.stubGlobal('fetch', mocks.fetch);
  vi.stubEnv('RESEND_API_KEY', 'fake-unit-test-key');
  vi.stubEnv('WHATSAPP_ACCESS_TOKEN', '');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function prepareNewOrder(totalAmount: number) {
  const update = queryResult([{ id: order.id }]);
  mocks.from.mockReturnValueOnce(queryResult({ ...order, total_amount: totalAmount }))
    .mockReturnValueOnce(update).mockReturnValueOnce(queryResult(null)).mockReturnValueOnce(queryResult([]));
  return update;
}

describe('Stripe-verified order confirmation', () => {
  it('preserves normal paid confirmation and records its payment evidence', async () => {
    const update = prepareNewOrder(39);
    await expect(confirmPaidOrder(paidSession)).resolves.toBe(true);
    expect(update.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'paid', payment_payload: expect.objectContaining({ payment_intent_id: 'pi_test_order', amount_total: 3900 }) }));
    expect(mocks.sync).toHaveBeenCalledWith(order.id, 'pi_test_order', expect.any(String));
  });

  it('fulfills a completed zero-total checkout without requiring a PaymentIntent', async () => {
    const update = prepareNewOrder(0);
    await expect(confirmPaidOrder(freeSession)).resolves.toBe(true);
    expect(update.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'paid', payment_payload: expect.objectContaining({ payment_status: 'no_payment_required', amount_total: 0 }) }));
    expect(mocks.sync).toHaveBeenCalledWith(order.id, null, expect.any(String));
  });

  it.each([
    { ...freeSession, status: 'open' },
    { ...freeSession, status: 'expired' },
    { ...freeSession, amount_total: 100 },
    { ...freeSession, payment_intent: 'pi_unexpected' },
    { ...paidSession, payment_status: 'unpaid' },
  ])('does not fulfill incomplete or inconsistent sessions: %j', async session => {
    await expect(confirmPaidOrder(session)).resolves.toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it.each([
    { session: { ...freeSession, currency: 'usd' }, total: 0 },
    { session: { ...freeSession, id: 'cs_different' }, total: 0 },
    { session: freeSession, total: 39 },
    { session: freeSession, total: 0.001 },
    { session: { ...paidSession, amount_total: 3800 }, total: 39 },
  ])('rejects amount, currency and stored-session mismatches: %j', async ({ session, total }) => {
    mocks.from.mockReturnValue(queryResult({ ...order, total_amount: total }));
    await expect(confirmPaidOrder(session)).rejects.toThrow('Checkout session mismatch');
    expect(mocks.from).toHaveBeenCalledOnce();
    expect(mocks.sync).not.toHaveBeenCalled();
  });

  it.each(['refunded', 'cancelled'])('never reconfirms a %s order', async status => {
    mocks.from.mockReturnValue(queryResult({ ...order, status, paid_at: '2026-10-01T00:00:00Z' }));
    await expect(confirmPaidOrder(paidSession)).resolves.toBe(false);
    expect(mocks.sync).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.from).toHaveBeenCalledOnce();
  });

  it('fails closed when cancellation wins the conditional payment update', async () => {
    mocks.from.mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult([]))
      .mockReturnValueOnce(queryResult({ status: 'cancelled', paid_at: null }));
    await expect(confirmPaidOrder(paidSession)).resolves.toBe(false);
    expect(mocks.sync).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('keeps repeated confirmation idempotent for notifications and coupons', async () => {
    mocks.from.mockReturnValueOnce(queryResult({ ...order, status: 'paid' }))
      .mockReturnValueOnce(queryResult([]))
      .mockReturnValueOnce(queryResult({ status: 'paid', paid_at: '2026-10-01T00:00:00Z' }))
      .mockReturnValueOnce(queryResult(null));
    await expect(confirmPaidOrder(paidSession)).resolves.toBe(true);
    expect(mocks.sync).toHaveBeenCalledOnce();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.from.mock.calls.some(([table]) => table === 'coupons')).toBe(false);
  });
});
