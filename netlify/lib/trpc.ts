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
  console.log("[requireAdmin] user?", !!opts.ctx.user, "role:", opts.ctx.user?.role, "path:", opts.path);
  if (!opts.ctx.user || opts.ctx.user.role !== "admin") {
    console.warn("[requireAdmin] REJECTED — role is:", opts.ctx.user?.role, "expected: admin");
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

    // Step 2: Read role from profiles table
    // CRITICAL: Use ANON_KEY as apikey + SERVICE_ROLE_KEY as Bearer to bypass RLS.
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${authUser.id}&limit=1`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    const profiles = await profileRes.json().catch(() => []);
    console.log("[verifySupabaseToken] profile query status:", profileRes.status, "profiles:", JSON.stringify(profiles));
    const role = Array.isArray(profiles) && profiles.length > 0
      ? profiles[0].role
      : "user";
    console.log("[verifySupabaseToken] resolved:", { id: authUser.id, email: authUser.email, role });

    return { id: authUser.id, role, email: authUser.email };
  } catch {
    console.error("[verifySupabaseToken] EXCEPTION");
    return undefined;
  }
}
