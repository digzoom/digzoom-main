import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
// Service role key bypasses RLS — safe for server-only use
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

interface TrpcContext {
  user?: { id: string; role: string; email?: string };
}

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

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

    // Step 2: Read role from profiles table
    // CRITICAL: Use SERVICE_ROLE_KEY as apikey to bypass RLS.
    // The new sb_secret_* format is NOT a valid JWT, so it cannot
    // be used as Bearer — but works perfectly as apikey.
    const roleKey = SERVICE_ROLE_KEY || ANON_KEY;
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${authUser.id}&limit=1`,
      {
        headers: { apikey: roleKey },
        signal: AbortSignal.timeout(5000),
      }
    );
    const profiles = await profileRes.json().catch(() => []);
    const role = profiles?.[0]?.role || "user";

    return { id: authUser.id, role, email: authUser.email };
  } catch {
    return undefined;
  }
}
