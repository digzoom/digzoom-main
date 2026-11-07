import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ from: vi.fn(), fetch: vi.fn() }));
vi.mock('../netlify/lib/supabase-admin', () => ({ getSupabaseAdmin: () => ({ from: mocks.from }) }));
import { verifySupabaseToken } from '../netlify/lib/trpc';
const row = (data: unknown, error: unknown = null) => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data, error }) }) }) });
beforeEach(() => {
  mocks.from.mockReset(); mocks.fetch.mockReset();
  mocks.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 'test-user', email: 'test@example.invalid' }) });
  vi.stubGlobal('fetch', mocks.fetch);
});
afterEach(() => vi.unstubAllGlobals());
describe('authoritative role revocation', () => {
  it('does not restore an inactive admin from profiles', async () => {
    mocks.from.mockReturnValueOnce(row({ role: 'admin', is_active: false })).mockReturnValueOnce(row({ role: 'admin' }));
    expect((await verifySupabaseToken('test-token'))?.role).toBe('user');
    expect(mocks.from).toHaveBeenCalledTimes(1);
  });
  it('fails closed on a role lookup error', async () => {
    mocks.from.mockReturnValue(row(null, { message: 'database unavailable' }));
    expect(await verifySupabaseToken('test-token')).toBeUndefined();
  });
  it('preserves an active administrator', async () => {
    mocks.from.mockReturnValue(row({ role: 'admin', is_active: true }));
    expect((await verifySupabaseToken('test-token'))?.role).toBe('admin');
  });
  it('preserves legacy profile fallback only when no role record exists', async () => {
    mocks.from.mockReturnValueOnce(row(null)).mockReturnValueOnce(row({ role: 'user' }));
    expect((await verifySupabaseToken('test-token'))?.role).toBe('user');
  });
});
