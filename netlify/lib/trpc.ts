import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

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
// DEFENSIVE: if profiles table doesn't exist, still return user with "user" role
export async function verifySupabaseToken(
  token: string
): Promise<TrpcContext["user"]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("[verifySupabaseToken] auth API returned:", res.status);
      return undefined;
    }

    const authUser = await res.json();
    if (!authUser.id) return undefined;

    // Try to get role from profiles table
    let role = "user";
    try {
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${authUser.id}&limit=1`,
        {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (profileRes.ok) {
        const profiles = await profileRes.json().catch(() => []);
        if (profiles?.[0]?.role) {
          role = profiles[0].role;
        }
      } else {
        console.warn(
          "[verifySupabaseToken] profiles query failed:",
          profileRes.status
        );
      }
    } catch (e: any) {
      console.warn("[verifySupabaseToken] profiles fetch error:", e.message);
    }

    return { id: authUser.id, role, email: authUser.email };
  } catch (e: any) {
    console.error("[verifySupabaseToken] fatal:", e.message);
    return undefined;
  }
}
