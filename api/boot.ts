import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

// CORS for hybrid setup (Netlify frontend + Railway backend)
app.use(cors({
  origin: env.isProduction 
    ? ["https://digzoom.com", "https://www.digzoom.com", "https://*.netlify.app"] 
    : ["http://localhost:3000", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
  credentials: true,
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
const handleTrpc = async (c: any) => {
  return fetchRequestHandler({
    endpoint: c.req.path.startsWith("/api/trpc") ? "/api/trpc" : "/api",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
};

// The current storefront calls /api directly. /api/trpc remains supported for
// clients that use the conventional tRPC path.
app.use("/api", handleTrpc);
app.use("/api/*", handleTrpc);
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
