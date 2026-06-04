import { initTRPC, TRPCError } from "@trpc/server";
import { getSupabaseAdmin } from "./supabase-admin";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

interface TrpcContext {
  user?: { id: string; role: string; email?: string };
}

// NOTE: superjson transformer removed — both client and server use plain JSON.
// This fixes the batch payload format mismatch.
const t = initTRPC.context<TrpcContext>().create();

export const createRouter = t.router;
export const publicQuery = t.procedure;

// Auth middleware — verifies Supabase token
const requireAuth = t.middleware(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required" });
  }
  return opts.next({ ctx: { user: opts.ctx.user } });
});

// Admin middleware — requires role === "admin"
const requireAdmin = t.middleware(async (opts) => {
  if (!opts.ctx.user || opts.ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
  return opts.next({ ctx: { user: opts.ctx.user } });
});

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireAdmin);

// Verify Supabase token and return user with role
export async function verifySupabaseToken(
  token: string
): Promise<TrpcContext["user"]> {
  try {
    // Step 1: Verify the user's access token with Supabase Auth
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return undefined;

    const authUser = await res.json();
    if (!authUser.id) return undefined;

    // Step 2: Read role using admin client (service role, bypasses RLS)
    // Same approach as meDebug endpoint — unified role resolution
    const admin = getSupabaseAdmin();

    // Check user_roles first
    const { data: userRole, error: rolesErr } = await admin
      .from('user_roles')
      .select('role, is_active')
      .eq('user_id', authUser.id)
      .maybeSingle();

    let resolvedRole: string;
    if (!rolesErr && userRole?.is_active === true && userRole?.role) {
      resolvedRole = userRole.role;
    } else {
      // Fallback: read from profiles
      const { data: profile, error: profileErr } = await admin
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle();
      resolvedRole = (!profileErr && profile?.role) || "user";
    }

    return { id: authUser.id, role: resolvedRole, email: authUser.email };
  } catch {
    return undefined;
  }
}
