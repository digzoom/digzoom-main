import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { getServicePlan } from "../../src/data/servicePlans";

const reply = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

export const handler: Handler = async event => {
  if (event.httpMethod !== "POST") return reply(405, { error: "Method not allowed" });
  if (process.env.CHECKOUT_ENABLED !== "true" || !process.env.STRIPE_SECRET_KEY)
    return reply(503, { error: "Secure checkout is temporarily unavailable" });

  let input: Record<string, unknown>;
  try { input = JSON.parse(event.body || "{}"); }
  catch { return reply(400, { error: "Invalid request" }); }

  const value = (key: string, max: number) => String(input[key] ?? "").trim().slice(0, max);
  const plan = getServicePlan(value("plan_id", 80));
  const name = value("name", 100);
  const email = value("email", 254).toLowerCase();
  const phone = value("phone", 30);
  const company = value("company", 140);
  if (!plan || !name || !phone || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.accepted !== true)
    return reply(400, { error: "Missing or invalid order details" });

  const orderId = `DZ-SRV-${randomUUID()}`;
  const database = getSupabaseAdmin();
  const { error: orderError } = await database.from("orders").insert({
    id: orderId, status: "pending", subtotal: plan.price, tax_amount: 0,
    total_amount: plan.price, discount_amount: 0, payment_method: "pending",
    customer_name: name, customer_email: email, customer_phone: phone,
    customer_input: {
      service_plan_id: plan.id, company, website: value("website", 500),
      access_ready: value("access_ready", 30), start_date: value("start_date", 30),
      billing_period: "first_month_only",
    },
    customer_notes: value("notes", 1500), payment_payload: {},
  });
  if (orderError) {
    console.error("[service-checkout] order insert failed", orderError);
    return reply(500, { error: "Unable to create order" });
  }

  const { error: itemError } = await database.from("order_items").insert({
    order_id: orderId, product_id: null, quantity: 1, price_at_time: plan.price,
    product_title: `${plan.nameAr} — الشهر الأول`, product_type: "manual_service",
    delivery_status: "pending", max_downloads: 0,
  });
  if (itemError) {
    console.error("[service-checkout] item insert failed", itemError);
    await database.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    return reply(500, { error: "Unable to create order" });
  }

  try {
    const siteUrl = (process.env.SITE_URL || process.env.URL || "https://digzoom.com").replace(/\/$/, "");
    const params = new URLSearchParams({
      mode: "payment", customer_email: email,
      "metadata[order_id]": orderId,
      "payment_intent_data[metadata][order_id]": orderId,
      success_url: `${siteUrl}/service-payment-success?order_id=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/service-checkout/${encodeURIComponent(plan.id)}?payment=cancelled`,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "sar",
      "line_items[0][price_data][unit_amount]": String(plan.price * 100),
      "line_items[0][price_data][product_data][name]": `${plan.nameEn} — first month`,
    });
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const session = await response.json() as { id?: string; url?: string; error?: { message?: string } };
    if (!response.ok || !session.id || !session.url) throw new Error(session.error?.message || "Stripe checkout failed");
    const { error: saveError } = await database.from("orders")
      .update({ payment_method: "stripe", payment_payload: { checkout_session_id: session.id } })
      .eq("id", orderId).eq("status", "pending");
    if (saveError) throw saveError;
    return reply(200, { orderId, checkoutUrl: session.url });
  } catch (error) {
    console.error("[service-checkout] session failed", error);
    await database.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    return reply(502, { error: "Unable to start secure payment" });
  }
};
