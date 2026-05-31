import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpLink } from '@trpc/react-query';
import { useState, type ReactNode } from 'react';

// Backend router type — not imported to avoid bundling server code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      // NOTE: superjson transformer removed — causes bundling issues.
      // Using httpLink (not httpBatchLink) to ensure Authorization header is sent.
      links: [
        httpLink({
          url: '/api',
          headers() {
            const token = localStorage.getItem('sb_access_token');
            console.log('[trpc:headers] token exists?', !!token, 'length:', token?.length || 0);
            if (token) {
              console.log('[trpc:headers] sending Authorization: Bearer ...' + token.slice(-10));
              return { Authorization: `Bearer ${token}` };
            }
            console.warn('[trpc:headers] NO TOKEN in localStorage');
            return {};
          },
          fetch(input, init) {
            console.log('[trpc:fetch] method:', init.method, 'url:', input);
            console.log('[trpc:fetch] request headers:', JSON.stringify(init.headers));
            return fetch(input, init);
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
