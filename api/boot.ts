import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { adminRouter } from "../netlify/lib/admin-router";
import { verifySupabaseToken } from "../netlify/lib/trpc";
import { getSupabaseAdmin } from "../netlify/lib/supabase-admin";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ["https://digzoom.com", "https://www.digzoom.com"]
    : ["http://localhost:3000", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
  credentials: true,
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

app.post("/api/contact", async (c) => {
  let payload: ContactPayload;
  try {
    payload = await c.req.json<ContactPayload>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const subject = payload.subject?.trim();
  const message = payload.message?.trim();
  if (!name || !email || !subject || !message) {
    return c.json({ error: "All fields are required" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Invalid email" }, 400);
  }
  if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 10_000) {
    return c.json({ error: "One or more fields are too long" }, 400);
  }

  const cleanPayload = { name, email, subject, message };
  const { error } = await getSupabaseAdmin()
    .from("contact_messages")
    .insert({ ...cleanPayload, status: "new" });
  if (error) {
    console.error("[contact] Supabase insert error:", error.code, error.message);
    return c.json({ error: "Failed to save message" }, 500);
  }

  let emailed = false;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DigZoom Contact <contact@digzoom.com>",
          to: "info@digzoom.com",
          reply_to: email,
          subject: `[DigZoom Contact] ${subject}`,
          html: `<h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
        }),
      });
      emailed = response.ok;
      if (!response.ok) console.error("[contact] Resend error:", await response.text());
    } catch (error) {
      console.error("[contact] Email error:", error);
    }
  }

  return c.json({ success: true, saved: true, emailed });
});

const handleTrpc = async (c: any) => {
  const authHeader = c.req.header("authorization");
  const user = authHeader?.startsWith("Bearer ")
    ? await verifySupabaseToken(authHeader.slice(7))
    : undefined;
  return fetchRequestHandler({
    endpoint: c.req.path.startsWith("/api/trpc") ? "/api/trpc" : "/api",
    req: c.req.raw,
    router: adminRouter,
    createContext: async () => ({ user }),
  });
};

app.use("/api", handleTrpc);
app.use("/api/*", handleTrpc);
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (process.env.NODE_ENV === "production") {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
