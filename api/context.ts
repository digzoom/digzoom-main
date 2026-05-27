import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

interface SupabaseAuthUser {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
}

interface SupabaseProfile {
  role?: string;
  full_name?: string;
  avatar_url?: string;
}

async function verifySupabaseToken(token: string): Promise<User | undefined> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return undefined;

    const authUser = (await res.json()) as SupabaseAuthUser;
    if (!authUser.id) return undefined;

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=role,full_name,avatar_url&id=eq.${authUser.id}&limit=1`,
      {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        signal: AbortSignal.timeout(10000),
      }
    );
    const profiles = (await profileRes.json().catch(() => [])) as SupabaseProfile[];
    const profile = profiles?.[0] || {};

    return {
      id: 0,
      unionId: authUser.id,
      name: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "",
      avatar: profile.avatar_url || authUser.user_metadata?.avatar_url || null,
      role: (profile.role as "user" | "admin") || "user",
      email: authUser.email || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };
  } catch {
    return undefined;
  }
}

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  const authHeader = opts.req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const user = await verifySupabaseToken(token);
    if (user) {
      ctx.user = user;
      return ctx;
    }
  }

  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Auth optional
  }

  return ctx;
}
