import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpLink } from '@trpc/react-query';
import { useState, type ReactNode } from 'react';
import type { AdminRouter } from '../../netlify/lib/admin-router';

export const trpc = createTRPCReact<AdminRouter>();

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
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          fetch(input, init) {
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
