import type { Handler } from "@netlify/functions";
import { getSupabaseAdmin } from "../lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "DigZoom Growth <contact@digzoom.com>";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@digzoom.com";

const allowedGoals = new Set([
  "sales",
  "leads",
  "launch",
  "visibility",
  "conversion",
]);
const allowedBudgets = new Set([
  "under-5k",
  "5k-15k",
  "15k-50k",
  "50k-plus",
  "unsure",
]);

function clean(value: unknown, max: number) {
  return String(value || "")
    .trim()
    .slice(0, max);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char] || char
  );
}

export const handler: Handler = async event => {
  if (event.httpMethod !== "POST")
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  try {
    const raw = JSON.parse(event.body || "{}");
    const requestedGoal = clean(raw.goal, 30);
    const isServiceOrder = requestedGoal === "service-order";
    const serviceDetails = isServiceOrder
      ? [
          `Plan: ${clean(raw.plan_name, 160)}`,
          `Plan ID: ${clean(raw.service_interest, 100)}`,
          `Amount: ${clean(raw.amount, 30)} SAR`,
          `Access ready: ${clean(raw.access_ready, 30)}`,
          `Preferred start date: ${clean(raw.start_date, 30)}`,
          `Notes: ${clean(raw.notes, 1500)}`,
        ].join("\n")
      : clean(raw.challenge, 2000);
    const payload = {
      name: clean(raw.name, 100),
      email: clean(raw.email, 254).toLowerCase(),
      phone: clean(raw.phone, 30),
      company: clean(raw.company, 140),
      website: clean(raw.website, 500),
      business_type: isServiceOrder
        ? `service:${clean(raw.service_interest, 92)}`
        : clean(raw.business_type, 100),
      goal: isServiceOrder ? "conversion" : requestedGoal,
      budget: isServiceOrder ? "unsure" : clean(raw.budget, 30),
      challenge: serviceDetails,
    };
    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.business_type ||
      !allowedGoals.has(payload.goal) ||
      !allowedBudgets.has(payload.budget)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid fields" }),
      };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email" }),
      };
    const ip = (
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"]?.split(",")[0] ||
      ""
    )
      .trim()
      .slice(0, 64);
    const supabase = getSupabaseAdmin();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("growth_audit_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since);
    if ((count || 0) >= 5)
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "Too many requests" }),
      };
    const { data, error } = await supabase
      .from("growth_audit_requests")
      .insert({
        ...payload,
        ip_address: ip || null,
        user_agent: event.headers["user-agent"]?.slice(0, 500) || null,
      })
      .select("id")
      .single();
    if (error) throw error;
    let emailed = false;
    if (RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: CONTACT_TO_EMAIL,
          reply_to: payload.email,
          subject: `${isServiceOrder ? "[DigZoom Service Order]" : "[DigZoom Growth]"} ${payload.company || payload.name} — ${isServiceOrder ? clean(raw.plan_name, 160) : payload.goal}`,
          html: `<h2>${isServiceOrder ? "New Service Order" : "New Growth Audit Request"}</h2><p><b>Name:</b> ${escapeHtml(payload.name)}</p><p><b>Company:</b> ${escapeHtml(payload.company)}</p><p><b>Email:</b> ${escapeHtml(payload.email)}</p><p><b>Phone:</b> ${escapeHtml(payload.phone)}</p><p><b>Business:</b> ${escapeHtml(payload.business_type)}</p><p><b>Goal:</b> ${escapeHtml(payload.goal)}</p><p><b>Budget:</b> ${escapeHtml(payload.budget)}</p><p><b>Website:</b> ${escapeHtml(payload.website)}</p><p><b>Details:</b><br>${escapeHtml(payload.challenge).replace(/\n/g, "<br>")}</p>`,
        }),
      });
      emailed = response.ok;
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, request_id: data.id, emailed }),
    };
  } catch (error) {
    console.error("[growth-audit]", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to submit request" }),
    };
  }
};
