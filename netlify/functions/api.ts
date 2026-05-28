import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { adminRouter } from "../lib/admin-router";
import { verifySupabaseToken } from "../lib/trpc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appRouter: any = adminRouter;

// Standard Netlify Function handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any, _context: any) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-trpc-source",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    };
  }

  try {
    // Parse request body for tRPC
    const headers = new Headers();
    Object.entries(event.headers || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) headers.set(k, String(v));
    });

    const req = new Request(event.rawUrl, {
      method: event.httpMethod,
      headers,
      body: event.body && event.httpMethod !== "GET"
        ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
        : undefined,
    });

    // Verify Supabase token
    let user = undefined;
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      user = await verifySupabaseToken(authHeader.slice(7));
    }

    // Route tRPC request
    const response = await fetchRequestHandler({
      endpoint: "/api",
      req,
      router: appRouter,
      createContext: async () => ({ user }),
      onError: (opts: any) => {
        console.error("[tRPC error] path:", opts.path, "message:", opts.error?.message);
      },
    });

    const body = await response.text();
    const resHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    response.headers.forEach((v: string, k: string) => {
      if (k.toLowerCase() !== "content-type") resHeaders[k] = v;
    });

    return { statusCode: response.status, headers: resHeaders, body };

  } catch (err: any) {
    console.error("[api] FATAL:", err?.stack || err?.message || err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: { json: { message: "Internal error: " + (err?.message || "unknown"), code: -32000 } },
      }),
    };
  }
};
