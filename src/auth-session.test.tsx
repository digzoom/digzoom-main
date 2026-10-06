// @vitest-environment jsdom
import { act, StrictMode, useEffect, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SupabaseAuthProvider, useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { TRPCProvider, trpc } from '@/providers/trpc';

// Use the real SDK, React Query and tRPC with a strictly mocked transport.
// No credentials, external accounts or network requests are used by these tests.
vi.mock('sonner', () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock('@/i18n/i18n', () => ({ default: { language: 'en' } }));

const sdk = vi.hoisted(() => ({ client: null as SupabaseClient | null }));
vi.mock('@/lib/supabase', () => ({
  supabase: { get auth() { return sdk.client!.auth; } },
}));

let root: Root;
let container: HTMLDivElement;
let auth: ReturnType<typeof useSupabaseAuth>;
let queryClient: QueryClient;
let storageKey: string;
let sequence = 0;
let refreshes: number;
let tokenExpiry: number;
let requests: { path: string; token: string | null; body: Record<string, string>; signal?: AbortSignal | null }[];
let intercept: ((url: URL, init?: RequestInit) => Promise<Response> | undefined) | undefined;

function token(id: string, generation = 0) {
  const encode = (value: object) => btoa(JSON.stringify(value)).replaceAll('=', '').replaceAll('+', '-').replaceAll('/', '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: id, exp: tokenExpiry, generation })}.test-signature`;
}

function session(id: string, generation = 0) {
  return {
    access_token: token(id, generation), refresh_token: `refresh-${id}-${generation}`,
    token_type: 'bearer' as const, expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id, email: `${id.toLowerCase()}@example.invalid`, user_metadata: { full_name: `Account ${id}`, role: 'admin' },
      app_metadata: {}, aud: 'authenticated', created_at: '2026-01-01T00:00:00Z' },
  };
}

function identity(init?: RequestInit) {
  const authorization = new Headers(init?.headers).get('Authorization');
  if (!authorization?.includes('.')) return null;
  return JSON.parse(atob(authorization.split('.')[1])).sub as string;
}

function AuthProbe({ children }: { children?: ReactNode }) {
  const value = useSupabaseAuth();
  useEffect(() => { auth = value; }, [value]);
  return <><div data-auth>{value.loading ? 'loading' : value.user?.id ?? 'signed-out'}</div>{children}</>;
}

function AccountQueries() {
  const client = useQueryClient();
  useEffect(() => { queryClient = client; }, [client]);
  const profile = trpc.getMyProfile.useQuery();
  const orders = trpc.listMyOrders.useQuery();
  return <div data-account>{profile.data?.full_name ?? 'loading profile'} / {orders.data?.[0]?.id ?? 'loading orders'}</div>;
}

function AccountPage() {
  const { session } = useSupabaseAuth();
  return session ? <AccountQueries /> : <div data-account>signed-out</div>;
}

async function render(withQueries = false, strict = false) {
  const tree = <SupabaseAuthProvider><AuthProbe>
    {withQueries && <TRPCProvider><AccountPage /></TRPCProvider>}
  </AuthProbe></SupabaseAuthProvider>;
  await act(async () => root.render(strict ? <StrictMode>{tree}</StrictMode> : tree));
  await settle();
}

async function settle() {
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
}

async function login(id: string) {
  await act(async () => { expect(await auth.login(`${id.toLowerCase()}@example.invalid`, 'mock-password')).toEqual({}); });
  await settle();
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  vi.mocked(toast.error).mockClear();
  vi.mocked(toast.dismiss).mockClear();
  storageKey = `auth-regression-${++sequence}`;
  refreshes = 0;
  tokenExpiry = Math.floor(Date.now() / 1000) + 3600;
  requests = [];
  intercept = undefined;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input), 'https://auth.example.invalid');
    requests.push({ path: url.pathname + url.search, token: new Headers(init?.headers).get('Authorization'),
      body: JSON.parse(String(init?.body || '{}')), signal: init?.signal });
    const intercepted = intercept?.(url, init);
    if (intercepted) return intercepted;
    if (url.pathname === '/auth/v1/token') {
      const body = JSON.parse(String(init?.body));
      if (url.searchParams.get('grant_type') === 'password') {
        return Response.json(session(body.email.startsWith('a@') ? 'A' : 'B'));
      }
      if (url.searchParams.get('grant_type') === 'pkce') return Response.json(session('A'));
      if (url.searchParams.get('grant_type') === 'refresh_token') {
        return Response.json(session(body.refresh_token.split('-')[1], ++refreshes));
      }
    }
    if (url.pathname === '/auth/v1/logout') return new Response(null, { status: 204 });
    const id = identity(init);
    if (url.pathname === '/rest/v1/profiles') return Response.json([{ full_name: `Account ${id}`, role: 'user' }]);
    if (url.pathname === '/rest/v1/user_roles') return Response.json([]);
    if (url.pathname === '/api/getMyProfile') return Response.json({ result: { data: { id, full_name: `Account ${id}` } } });
    if (url.pathname === '/api/listMyOrders') return Response.json({ result: { data: [{ id: `${id}-order`, items: [] }] } });
    throw new Error(`Unexpected mock request: ${url.pathname}`);
  }));
  sdk.client = createClient('https://auth.example.invalid', 'mock-public-key', {
    auth: { storageKey, storage: localStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, init) },
  });
  await sdk.client.auth.initialize();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  await sdk.client!.auth.stopAutoRefresh();
  container.remove();
  window.history.replaceState({}, '', '/');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('SDK password session lifecycle', () => {
  it('persists the complete password session, restores it, and refreshes an expired session on remount', async () => {
    await render();
    await login('A');
    expect(auth.user?.id).toBe('A');
    // User-editable metadata never grants an administrative role.
    expect(auth.isAdmin).toBe(false);
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toMatchObject({ refresh_token: 'refresh-A-0' });
    expect((await sdk.client!.auth.getSession()).data.session?.user.id).toBe('A');
    await act(async () => root.unmount());
    root = createRoot(container);
    await render(false, true);
    expect(auth.user?.id).toBe('A');
    expect(refreshes).toBe(0);

    await act(async () => root.unmount());
    const stored = JSON.parse(localStorage.getItem(storageKey)!);
    localStorage.setItem(storageKey, JSON.stringify({ ...stored, expires_at: 1 }));
    root = createRoot(container);
    await render(false, true);
    expect(auth.user?.id).toBe('A');
    expect(refreshes).toBe(1);
    expect(requests.find(request => request.path.includes('grant_type=refresh_token'))?.body.refresh_token).toBe('refresh-A-0');
    expect(localStorage.getItem('sb_refresh_token')).toBe('refresh-A-1');
    expect(localStorage.getItem('sb_access_token')).toBe(token('A', 1));
  });

  it('updates API tokens on SDK refresh and does not restore an orphaned legacy token', async () => {
    localStorage.setItem('sb_access_token', token('A'));
    localStorage.setItem('sb_refresh_token', 'orphaned');
    await render(true);
    expect(auth.user).toBeNull();
    expect(localStorage.getItem('sb_access_token')).toBeNull();
    await login('A');
    const originalCache = queryClient;
    await act(async () => { await sdk.client!.auth.refreshSession(); });
    expect(auth.user?.id).toBe('A');
    expect(queryClient).toBe(originalCache);
    expect(localStorage.getItem('sb_refresh_token')).toBe('refresh-A-1');
    await act(async () => { await queryClient.invalidateQueries(); });
    await settle();
    expect(requests.filter(request => request.path.startsWith('/api/')).slice(-2).every(request => request.token === `Bearer ${token('A', 1)}`)).toBe(true);
  });

  it('exchanges a one-time recovery code once under StrictMode and retains the reset route', async () => {
    localStorage.setItem(`${storageKey}-code-verifier`, JSON.stringify('mock-verifier'));
    window.history.replaceState({}, '', '/reset-password?code=mock-code&type=recovery');
    await render(false, true);
    expect(auth.session?.user.id).toBe('A');
    expect(auth.user?.id).toBe('A');
    expect(window.location.pathname).toBe('/reset-password');
    expect(window.location.search).toBe('');
    expect(requests.filter(request => request.path.includes('grant_type=pkce'))).toHaveLength(1);
  });

  it('reports a failed sign out once without rejecting or clearing the valid session/cache', async () => {
    await render(true);
    await login('A');
    const originalCache = queryClient;
    intercept = url => url.pathname === '/auth/v1/logout'
      ? Promise.resolve(Response.json({ message: 'Mock service failure' }, { status: 500 }))
      : undefined;
    await act(async () => {
      await expect(auth.logout()).resolves.toEqual({ error: "Couldn't sign out. Please try again." });
    });
    expect(toast.error).toHaveBeenCalledWith("Couldn't sign out. Please try again.", { id: 'auth-sign-out-error', duration: 5000 });
    expect(auth.user?.id).toBe('A');
    expect(auth.session?.user.id).toBe('A');
    expect(queryClient).toBe(originalCache);
    expect(localStorage.getItem(storageKey)).not.toBeNull();
    expect(localStorage.getItem('sb_access_token')).toBe(token('A'));
    intercept = undefined;
    await act(async () => { expect(await auth.logout()).toEqual({}); });
    expect(auth.user).toBeNull();
    expect(toast.dismiss).toHaveBeenLastCalledWith('auth-sign-out-error');
  });

  it('clears SDK and mirrored tokens on sign out and stays signed out after remount', async () => {
    await render();
    await login('A');
    await act(async () => { await auth.logout(); });
    expect(auth.user).toBeNull();
    expect(auth.session).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(localStorage.getItem('sb_access_token')).toBeNull();
    expect(localStorage.getItem('sb_refresh_token')).toBeNull();
    expect(requests.some(request => request.path === '/auth/v1/logout?scope=global')).toBe(true);
    await act(async () => root.unmount());
    root = createRoot(container);
    await render();
    expect(auth.user).toBeNull();
  });
});

describe('account cache and request isolation', () => {
  it('never serves A profile/orders to B during A → logout → B within stale time', async () => {
    await render(true);
    await login('A');
    expect(container.querySelector('[data-account]')?.textContent).toBe('Account A / A-order');
    const oldClient = queryClient;
    await act(async () => { await auth.logout(); });
    expect(container.querySelector('[data-account]')?.textContent).toBe('signed-out');
    expect(oldClient.getQueryCache().getAll()).toHaveLength(0);
    await login('B');
    expect(queryClient).not.toBe(oldClient);
    expect(container.querySelector('[data-account]')?.textContent).toBe('Account B / B-order');
    expect(requests.filter(request => request.path.startsWith('/api/')).map(request => request.token)).toEqual([
      `Bearer ${token('A')}`, `Bearer ${token('A')}`, `Bearer ${token('B')}`, `Bearer ${token('B')}`,
    ]);
  });

  it('cancels outstanding A queries and ignores late A responses even if transport ignores abort', async () => {
    const lateProfile = deferred<Response>();
    const lateOrders = deferred<Response>();
    intercept = (url, init) => {
      if (identity(init) === 'A' && url.pathname === '/api/getMyProfile') return lateProfile.promise;
      if (identity(init) === 'A' && url.pathname === '/api/listMyOrders') return lateOrders.promise;
    };
    await render(true);
    await login('A');
    const oldClient = queryClient;
    const oldRequests = requests.filter(request => request.path.startsWith('/api/'));
    expect(oldRequests).toHaveLength(2);
    await act(async () => { await auth.logout(); });
    expect(oldRequests.every(request => request.signal?.aborted)).toBe(true);
    await login('B');
    await act(async () => {
      lateProfile.resolve(Response.json({ result: { data: { id: 'A', full_name: 'Account A' } } }));
      lateOrders.resolve(Response.json({ result: { data: [{ id: 'A-order', items: [] }] } }));
    });
    await settle();
    expect(container.querySelector('[data-account]')?.textContent).toBe('Account B / B-order');
    expect(oldClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it('also isolates direct A → B sign in under StrictMode without an intervening logout', async () => {
    await render(true, true);
    await login('A');
    const oldClient = queryClient;
    await login('B');
    expect(oldClient.getQueryCache().getAll()).toHaveLength(0);
    expect(container.querySelector('[data-account]')?.textContent).toBe('Account B / B-order');
  });

  it('ignores an old session restoration that resolves after a newer sign in', async () => {
    const delayed = deferred<Awaited<ReturnType<SupabaseClient['auth']['getSession']>>>();
    vi.spyOn(sdk.client!.auth, 'getSession').mockImplementationOnce(() => delayed.promise);
    await render();
    await login('B');
    await act(async () => { delayed.resolve({ data: { session: session('A') }, error: null }); });
    expect(auth.user?.id).toBe('B');
    expect(auth.session?.user.id).toBe('B');
  });

  it('does not resurrect A when an old auth profile response finishes after logout and B login', async () => {
    const delayed = deferred<Response>();
    let pendingProfileSignal: AbortSignal | null | undefined;
    intercept = (url, init) => {
      if (url.pathname === '/rest/v1/profiles' && identity(init) === 'A') {
        pendingProfileSignal = init?.signal;
        return delayed.promise;
      }
    };
    await render();
    let loginA!: Promise<{ error?: string }>;
    await act(async () => { loginA = auth.login('a@example.invalid', 'mock-password'); });
    await settle();
    expect(auth.session?.user.id).toBe('A');
    await act(async () => { await auth.logout(); });
    expect(pendingProfileSignal?.aborted).toBe(true);
    await login('B');
    await act(async () => {
      delayed.resolve(Response.json([{ full_name: 'Account A', role: 'admin' }]));
      await loginA;
    });
    expect(auth.user?.id).toBe('B');
    expect(auth.user?.name).toBe('Account B');
    expect(auth.isAdmin).toBe(false);
  });
});
