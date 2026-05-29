import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { adminRouter } from "../lib/admin-router";
import { verifySupabaseToken } from "../lib/trpc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appRouter: any = adminRouter;

// Netlify Function handler — must ALWAYS return JSON, never HTML
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
    // Build headers
    const headers = new Headers();
    Object.entries(event.headers || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) headers.set(k, String(v));
    });

    // CRITICAL: Ensure Content-Type is set for POST/PUT requests
    // so fetchRequestHandler can parse the body correctly
    if (
      event.httpMethod === "POST" &&
      !headers.has("content-type") &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json");
    }

    // Defensive body parsing: Netlify may send body as string, object, or Buffer.
    let bodyStr: string | undefined;
    if (event.body && event.httpMethod !== "GET") {
      if (typeof event.body === "string") {
        bodyStr = event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString("utf8")
          : event.body;
      } else if (typeof event.body === "object") {
        // Netlify pre-parsed the body as JSON — re-serialize
        bodyStr = JSON.stringify(event.body);
      } else if (Buffer.isBuffer(event.body)) {
        bodyStr = event.body.toString("utf8");
      }
    }

    // DEBUG: Log what we received and what we're sending
    console.log("[api] method:", event.httpMethod);
    console.log("[api] rawUrl:", event.rawUrl);
    console.log("[api] content-type:", headers.get("content-type"));
    console.log("[api] body type:", typeof event.body);
    console.log("[api] body is buffer:", Buffer.isBuffer(event.body));
    console.log("[api] body length:", bodyStr?.length ?? 0);
    console.log("[api] body preview:", bodyStr?.substring(0, 500));

    const req = new Request(event.rawUrl, {
      method: event.httpMethod,
      headers,
      body: bodyStr,
    });

    // Verify Supabase token
    let user = undefined;
    const authHeader =
      event.headers?.authorization || event.headers?.Authorization;
    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.startsWith("Bearer ")
    ) {
      user = await verifySupabaseToken(authHeader.slice(7));
      console.log("[api] auth user:", user?.email, "role:", user?.role);
    } else {
      console.log("[api] no auth header");
    }

    // Route tRPC request
    const response = await fetchRequestHandler({
      endpoint: "/api",
      req,
      router: appRouter,
      createContext: async () => ({ user }),
      onError: (opts: any) => {
        console.error(
          "[tRPC error] path:",
          opts.path,
          "message:",
          opts.error?.message,
          "code:",
          opts.error?.code
        );
      },
    });

    const body = await response.text();
    console.log("[api] response status:", response.status, "body length:", body.length);

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
        error: {
          json: {
            message: "Internal error: " + (err?.message || "unknown"),
            code: -32000,
          },
        },
      }),
    };
  }
};
