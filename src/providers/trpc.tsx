import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
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
      // tRPC uses plain JSON serialization which matches the batch format.
      links: [
        httpBatchLink({
          url: '/api',
          headers() {
            const token = localStorage.getItem('sb_access_token');
            if (token) {
              return { Authorization: `Bearer ${token}` };
            }
            return {};
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
