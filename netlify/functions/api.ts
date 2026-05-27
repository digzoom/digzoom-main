import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { adminRouter } from "../lib/admin-router";
import { verifySupabaseToken } from "../lib/trpc";

// Netlify Function handler (standard format)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appRouter: any = adminRouter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (request: any, context: any) => {
  try {
    // Build standard Request from Netlify event
    const url = new URL(request.url);
    const req = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body && request.method !== "GET" ? request.body : undefined,
    });

    // Verify Supabase token
    let user = undefined;
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      user = await verifySupabaseToken(token);
    }

    // Handle via tRPC
    const response = await fetchRequestHandler({
      endpoint: "/api",
      req,
      router: appRouter,
      createContext: async () => ({ user }),
    });

    // Copy response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value: string, key: string) => { headers[key] = value; });

    const body = await response.text();
    return new Response(body, { status: response.status, headers });

  } catch (err: any) {
    console.error("[netlify/api] Error:", err.message || err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Also support Netlify Functions event format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any, netlifyContext: any) => {
  const req = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: new Headers(event.headers as Record<string, string>),
    body: event.body && event.httpMethod !== "GET" ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8") : undefined,
  });

  try {
    let user = undefined;
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      user = await verifySupabaseToken(authHeader.slice(7));
    }

    const response = await fetchRequestHandler({
      endpoint: "/api",
      req,
      router: appRouter,
      createContext: async () => ({ user }),
    });

    const body = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((v: string, k: string) => { headers[k] = v; });

    return { statusCode: response.status, headers, body, isBase64Encoded: false };

  } catch (err: any) {
    console.error("[netlify/handler] Error:", err.message || err);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Internal server error" }), isBase64Encoded: false };
  }
};
