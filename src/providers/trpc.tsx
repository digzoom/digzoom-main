import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpLink } from '@trpc/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import type { AdminRouter } from '../../netlify/lib/admin-router';

// eslint-disable-next-line react-refresh/only-export-components -- Typed hooks and their provider share one tRPC context.
export const trpc = createTRPCReact<AdminRouter>();

export function TRPCProvider({ children }: { children: ReactNode }) {
  const { session } = useSupabaseAuth();
  const userId = session?.user.id ?? null;
  // Changing identity remounts query observers and local account UI as well as
  // giving the new account a completely separate cache/client.
  return <IdentityTRPCProvider key={userId ?? 'signed-out'} userId={userId}>
    {children}
  </IdentityTRPCProvider>;
}

function IdentityTRPCProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
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
          async headers() {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            // Never let an old request/retry run using the next account's token.
            if ((session?.user.id ?? null) !== userId) {
              throw new Error('Account changed; request cancelled');
            }
            return session ? { Authorization: `Bearer ${session.access_token}` } : {};
          },
          fetch(input, init) {
            return fetch(input, init);
          },
        }),
      ],
    })
  );

  useEffect(() => () => {
    // Cancellation is synchronous; clearing also discards mutation results.
    // Even transports that finish after cancellation belong to this old client.
    void queryClient.cancelQueries();
    queryClient.clear();
  }, [queryClient]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient} abortOnUnmount>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
