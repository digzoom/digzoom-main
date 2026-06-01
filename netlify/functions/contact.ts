import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

async function saveToSupabase(payload: ContactPayload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      status: "new",
    }),
  });
  return res.ok;
}

async function sendEmail(payload: ContactPayload) {
  if (!RESEND_API_KEY) {
    console.log("[contact] RESEND_API_KEY not set, skipping email");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DigZoom Contact <contact@digzoom.com>",
        to: "info@digzoom.com",
        reply_to: payload.email,
        subject: `[DigZoom Contact] ${payload.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p style="color:#999;font-size:12px;">Sent from digzoom.com/contact</p>
        `,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[contact] Resend error:", err);
      return false;
    }
    console.log("[contact] Email sent successfully");
    return true;
  } catch (e: any) {
    console.error("[contact] Email send exception:", e.message);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const origin = event.headers?.origin || "";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload: ContactPayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Validate
  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return {
      statusCode: 400,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "All fields are required" }),
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return {
      statusCode: 400,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "Invalid email" }),
    };
  }

  console.log("[contact] Received from:", payload.email, "subject:", payload.subject);

  // Save to Supabase
  const saved = await saveToSupabase(payload);
  if (!saved) {
    return {
      statusCode: 500,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "Failed to save message" }),
    };
  }
  console.log("[contact] Saved to Supabase");

  // Send email (best effort — works when RESEND_API_KEY is configured)
  const emailed = await sendEmail(payload);

  return {
    statusCode: 200,
    headers: corsHeaders(origin),
    body: JSON.stringify({
      success: true,
      saved: true,
      emailed: emailed,
      note: emailed
        ? "Message saved and email sent"
        : "Message saved. Email not sent (RESEND_API_KEY not configured)",
    }),
  };
};
