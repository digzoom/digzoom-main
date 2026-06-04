import { initTRPC, TRPCError } from "@trpc/server";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
// Service role key bypasses RLS — safe for server-only use
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

    // Step 2: Read role from user_roles first (overrides profiles.role)
    // Use SERVICE_ROLE_KEY as apikey to bypass RLS.
    const serviceHeaders = { apikey: SERVICE_ROLE_KEY || ANON_KEY };

    // Check user_roles for definitive role
    const rolesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_roles?select=role,is_active&user_id=eq.${authUser.id}&limit=1`,
      { headers: serviceHeaders, signal: AbortSignal.timeout(5000) }
    );
    const userRoles = await rolesRes.json().catch(() => []);
    const ur = Array.isArray(userRoles) ? userRoles[0] : null;

    let resolvedRole: string;
    if (ur?.is_active === true && ur?.role) {
      resolvedRole = ur.role;
    } else {
      // Fallback: read from profiles
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${authUser.id}&limit=1`,
        { headers: serviceHeaders, signal: AbortSignal.timeout(5000) }
      );
      const profiles = await profileRes.json().catch(() => []);
      resolvedRole = (Array.isArray(profiles) && profiles[0]?.role) || "user";
    }

    return { id: authUser.id, role: resolvedRole, email: authUser.email };
  } catch {
    return undefined;
  }
}
