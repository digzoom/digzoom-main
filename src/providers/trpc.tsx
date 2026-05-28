import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { useState, type ReactNode } from 'react';
import superjson from 'superjson';

// Backend router type — not imported to avoid bundling server code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error: any) => {
          // Don't retry on auth errors
          if (error?.data?.code === 'UNAUTHORIZED' || error?.data?.code === 'FORBIDDEN') {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
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
          // Handle non-JSON responses gracefully
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fetch: async (url, options: any) => {
            const res = await fetch(url, options);
            // If response is not JSON, create a synthetic error response
            const contentType = res.headers.get('content-type');
            if (contentType && !contentType.includes('application/json')) {
              const text = await res.text();
              console.error('[tRPC] Non-JSON response:', res.status, text.substring(0, 200));
              // Return a synthetic JSON error response
              return new Response(
                JSON.stringify({
                  error: {
                    json: {
                      message: `Server returned ${res.status} (${contentType}). Check Netlify Function logs.`,
                      code: -32000,
                    },
                  },
                }),
                { status: 200, headers: { 'content-type': 'application/json' } }
              );
            }
            return res;
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
