import type { Handler } from "@netlify/functions";
import { getSupabaseAdmin } from "../lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.CONTACT_FROM_EMAIL || "DigZoom Partners <contact@digzoom.com>";
const TO = process.env.CONTACT_TO_EMAIL || "info@digzoom.com";
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const html = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] || c));

export const handler: Handler = async event => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const raw = JSON.parse(event.body || "{}");
    const payload = {
      name: clean(raw.name, 100), email: clean(raw.email, 254).toLowerCase(), phone: clean(raw.phone, 30),
      brand: clean(raw.brand, 120), product_type: clean(raw.product_type, 120), preview_url: clean(raw.preview_url, 500),
      suggested_price: raw.suggested_price === "" || raw.suggested_price == null ? null : Number(raw.suggested_price),
      description: clean(raw.description, 2000), rights_confirmed: raw.rights_confirmed === true || raw.rights_confirmed === "true",
    };
    if (!payload.name || !payload.email || !payload.phone || !payload.product_type || !payload.preview_url || !payload.description || !payload.rights_confirmed) return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return { statusCode: 400, body: JSON.stringify({ error: "Invalid email" }) };
    let url: URL; try { url = new URL(payload.preview_url); } catch { return { statusCode: 400, body: JSON.stringify({ error: "Invalid preview URL" }) }; }
    if (!["http:", "https:"].includes(url.protocol)) return { statusCode: 400, body: JSON.stringify({ error: "Invalid preview URL" }) };
    if (payload.suggested_price !== null && (!Number.isFinite(payload.suggested_price) || payload.suggested_price < 0 || payload.suggested_price > 100000)) return { statusCode: 400, body: JSON.stringify({ error: "Invalid price" }) };
    const ip = (event.headers["x-nf-client-connection-ip"] || event.headers["x-forwarded-for"]?.split(",")[0] || "").trim().slice(0, 64);
    const supabase = getSupabaseAdmin();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase.from("partner_applications").select("id", { count: "exact", head: true }).eq("ip_address", ip).gte("created_at", since);
    if ((count || 0) >= 3) return { statusCode: 429, body: JSON.stringify({ error: "Too many requests" }) };
    const { data, error } = await supabase.from("partner_applications").insert({ ...payload, ip_address: ip || null, user_agent: event.headers["user-agent"]?.slice(0, 500) || null }).select("id").single();
    if (error) throw error;
    if (RESEND_API_KEY) await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: FROM, to: TO, reply_to: payload.email, subject: `[DigZoom Partner] ${payload.brand || payload.name}`, html: `<h2>Digital Partner Application</h2><p><b>Name:</b> ${html(payload.name)}</p><p><b>Brand:</b> ${html(payload.brand)}</p><p><b>Email:</b> ${html(payload.email)}</p><p><b>Phone:</b> ${html(payload.phone)}</p><p><b>Type:</b> ${html(payload.product_type)}</p><p><b>Price:</b> ${payload.suggested_price ?? "Not set"}</p><p><b>Preview:</b> ${html(payload.preview_url)}</p><p><b>Description:</b><br>${html(payload.description).replace(/\n/g, "<br>")}</p>` }) });
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true, application_id: data.id }) };
  } catch (error) { console.error("[partner-application]", error); return { statusCode: 500, body: JSON.stringify({ error: "Unable to submit" }) }; }
};
