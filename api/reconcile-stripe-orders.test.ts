import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryResult } from './test-utils/mock-query';

const mocks = vi.hoisted(() => ({ from: vi.fn(), confirm: vi.fn(), sync: vi.fn(), fetch: vi.fn() }));
vi.mock('../netlify/lib/supabase-admin', () => ({ getSupabaseAdmin: () => ({ from: mocks.from }) }));
vi.mock('../netlify/lib/order-confirmation', () => ({ confirmPaidOrder: mocks.confirm }));
vi.mock('../netlify/lib/merchant-ledger', () => ({ syncMerchantPayment: mocks.sync }));
import reconcile from '../netlify/functions/reconcile-stripe-orders.mts';

const session = { id: 'cs_live_order', status: 'complete', payment_status: 'no_payment_required', amount_total: 0, currency: 'sar', metadata: { order_id: 'DZ-free-order' } };
beforeEach(() => {
  mocks.from.mockReset(); mocks.confirm.mockReset(); mocks.sync.mockReset(); mocks.fetch.mockReset();
  mocks.from.mockReturnValueOnce(queryResult([]))
    .mockReturnValueOnce(queryResult([{ id: 'DZ-free-order', payment_payload: { checkout_session_id: 'cs_live_order' } }]));
  mocks.fetch.mockResolvedValue({ ok: true, json: async () => session });
  mocks.confirm.mockResolvedValue(true);
  vi.stubGlobal('fetch', mocks.fetch);
  vi.stubEnv('STRIPE_SECRET_KEY', 'fake-unit-test-key');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('missed-webhook reconciliation', () => {
  it('routes a completed zero-total session through shared strict confirmation', async () => {
    await reconcile();
    expect(mocks.confirm).toHaveBeenCalledWith(session);
  });

  it('does not confirm a session belonging to another order', async () => {
    mocks.fetch.mockResolvedValue({ ok: true, json: async () => ({ ...session, metadata: { order_id: 'DZ-other-order' } }) });
    await reconcile();
    expect(mocks.confirm).not.toHaveBeenCalled();
  });
});
