import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { queryResult } from './test-utils/mock-query';
import { canDeliverOrder, productDownloadFilename } from '../netlify/lib/order-delivery';

const mocks = vi.hoisted(() => ({ from: vi.fn(), sign: vi.fn(), confirm: vi.fn(), fetch: vi.fn() }));
vi.mock('../netlify/lib/supabase-admin', () => ({ getSupabaseAdmin: () => ({ from: mocks.from, storage: { from: () => ({ createSignedUrl: mocks.sign }) } }) }));
vi.mock('../netlify/lib/order-confirmation', () => ({ confirmPaidOrder: mocks.confirm, sendOrderEmail: vi.fn() }));
import { adminRouter } from '../netlify/lib/admin-router';

const order = { id: 'DZ-test-order', user_id: 'owner', status: 'paid', paid_at: '2026-10-01T00:00:00Z', payment_payload: { checkout_session_id: 'cs_test_order' } };
const guestInput = { order_id: order.id, session_id: 'cs_test_order' };
const owner = () => adminRouter.createCaller({ user: { id: 'owner', role: 'user' } });

beforeEach(() => {
  mocks.from.mockReset(); mocks.sign.mockReset(); mocks.confirm.mockReset(); mocks.fetch.mockReset();
  mocks.confirm.mockResolvedValue(true);
  mocks.sign.mockResolvedValue({ data: { signedUrl: 'https://files.invalid/signed' }, error: null });
  mocks.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 'cs_test_order', payment_status: 'paid', metadata: { order_id: order.id } }) });
  vi.stubGlobal('fetch', mocks.fetch);
  vi.stubEnv('STRIPE_SECRET_KEY', 'fake-unit-test-key');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('order delivery access', () => {
  it.each(['refunded', 'cancelled'])('rejects %s for the owner and checkout-session bearer before any file access', async status => {
    mocks.from.mockImplementation(() => queryResult({ ...order, status }));
    await expect(owner().listOrderDownloads({ order_id: order.id })).rejects.toThrow('Downloads are not available');
    await expect(adminRouter.createCaller({}).listOrderDownloads(guestInput)).rejects.toThrow('Downloads are not available');
    await expect(owner().createDownloadLink({ order_id: order.id, order_item_id: 1 })).rejects.toThrow('Downloads are not available');
    expect(mocks.from.mock.calls.every(([table]) => table === 'orders')).toBe(true);
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.confirm).not.toHaveBeenCalled();
    expect(mocks.sign).not.toHaveBeenCalled();
  });

  it.each(['paid', 'processing', 'completed'])('preserves owner access to a %s order', async status => {
    mocks.from.mockReturnValueOnce(queryResult({ ...order, status })).mockReturnValueOnce(queryResult([]));
    await expect(owner().listOrderDownloads({ order_id: order.id })).resolves.toEqual([]);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('rejects an unrelated user and an incorrect session', async () => {
    mocks.from.mockImplementation(() => queryResult(order));
    await expect(adminRouter.createCaller({ user: { id: 'other', role: 'user' } }).listOrderDownloads({ order_id: order.id })).rejects.toThrow('Downloads are not available');
    await expect(adminRouter.createCaller({}).listOrderDownloads({ ...guestInput, session_id: 'cs_wrong_order' })).rejects.toThrow('Download authorization failed');
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('allows a verified session only after current stored payment eligibility is re-read', async () => {
    mocks.from.mockReturnValueOnce(queryResult({ ...order, status: 'pending', paid_at: null }))
      .mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult([]));
    await expect(adminRouter.createCaller({}).listOrderDownloads(guestInput)).resolves.toEqual([]);
    expect(mocks.confirm).toHaveBeenCalledOnce();
  });

  it.each(['refunded', 'cancelled', 'pending'])('denies a session if the current order becomes %s during confirmation', async status => {
    mocks.from.mockReturnValueOnce(queryResult({ ...order, status: 'pending', paid_at: null }))
      .mockReturnValueOnce(queryResult({ ...order, status, paid_at: status === 'pending' ? null : order.paid_at }));
    await expect(adminRouter.createCaller({}).listOrderDownloads(guestInput)).rejects.toThrow('Downloads are not available');
    expect(mocks.sign).not.toHaveBeenCalled();
  });

  it('does not grant access when confirmation returns false', async () => {
    mocks.from.mockReturnValue(queryResult({ ...order, status: 'pending', paid_at: null }));
    mocks.confirm.mockResolvedValue(false);
    await expect(adminRouter.createCaller({}).listOrderDownloads(guestInput)).rejects.toThrow('Downloads are not available');
    expect(mocks.from).toHaveBeenCalledOnce();
  });

  it('does not deliver an unpaid pending order', () => {
    expect(canDeliverOrder({ status: 'pending', paid_at: null })).toBe(false);
  });
});

describe('download filenames', () => {
  it.each(['pdf', 'zip', 'xlsx'])('preserves the original %s extension through signed-link creation', async extension => {
    mocks.from.mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult({ id: 1, product_id: 5, download_count: 0, max_downloads: 5 }))
      .mockReturnValueOnce(queryResult({ storage_path: `5/file.${extension.toUpperCase()}`, title_en: 'Test file', file_type: 'XLSX' }))
      .mockReturnValueOnce(queryResult({ id: 1 })).mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult(null)).mockReturnValueOnce(queryResult(order));
    await expect(owner().createDownloadLink({ order_id: order.id, order_item_id: 1 })).resolves.toEqual({ url: 'https://files.invalid/signed', expires_in: 120 });
    expect(mocks.sign).toHaveBeenCalledWith(`5/file.${extension.toUpperCase()}`, 120, { download: `Test file.${extension}` });
  });

  it('uses only safe names and supported extensions, with a neutral fallback', () => {
    expect(productDownloadFilename('5/file', 'Report.pdf', 'PDF')).toBe('Report.pdf');
    expect(productDownloadFilename('5/file.exe', '../\r\n', 'unknown')).toBe('digzoom-product.bin');
    expect(productDownloadFilename('5/file.zip', 'ملف عربي', null)).toBe('digzoom-product.zip');
  });

  it.each(['refunded', 'cancelled'])('does not sign if %s wins after initial authorization', async status => {
    const rollback = queryResult(null);
    mocks.from.mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult({ id: 1, product_id: 5, download_count: 0, max_downloads: 5 }))
      .mockReturnValueOnce(queryResult({ storage_path: '5/file.pdf', title_en: 'Test' }))
      .mockReturnValueOnce(queryResult({ id: 1 })).mockReturnValueOnce(queryResult({ ...order, status }))
      .mockReturnValueOnce(rollback);
    await expect(owner().createDownloadLink({ order_id: order.id, order_item_id: 1 })).rejects.toThrow('Downloads are not available');
    expect(mocks.sign).not.toHaveBeenCalled();
    expect(rollback.eq).toHaveBeenCalledWith('download_count', 1);
  });

  it.each(['refunded', 'cancelled'])('does not expose a URL if %s wins during signing or logging', async status => {
    const rollback = queryResult(null);
    mocks.from.mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult({ id: 1, product_id: 5, download_count: 0, max_downloads: 5 }))
      .mockReturnValueOnce(queryResult({ storage_path: '5/file.pdf', title_en: 'Test' }))
      .mockReturnValueOnce(queryResult({ id: 1 })).mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult(null)).mockReturnValueOnce(queryResult({ ...order, status }))
      .mockReturnValueOnce(rollback);
    await expect(owner().createDownloadLink({ order_id: order.id, order_item_id: 1 })).rejects.toThrow('Downloads are not available');
    expect(mocks.sign).toHaveBeenCalledOnce();
    expect(rollback.eq).toHaveBeenCalledWith('download_count', 1);
  });

  it('does not expose a guest link if its stored checkout reference changes during signing', async () => {
    mocks.from.mockReturnValueOnce(queryResult(order)).mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult({ id: 1, product_id: 5, download_count: 0, max_downloads: 5 }))
      .mockReturnValueOnce(queryResult({ storage_path: '5/file.pdf', title_en: 'Test' }))
      .mockReturnValueOnce(queryResult({ id: 1 })).mockReturnValueOnce(queryResult(order))
      .mockReturnValueOnce(queryResult(null))
      .mockReturnValueOnce(queryResult({ ...order, payment_payload: { checkout_session_id: 'cs_replacement' } }))
      .mockReturnValueOnce(queryResult(null));
    await expect(adminRouter.createCaller({}).createDownloadLink({ ...guestInput, order_item_id: 1 })).rejects.toThrow('Downloads are not available');
  });
});
