import type { Config } from "@netlify/functions";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { confirmPaidOrder } from "../lib/order-confirmation";

// A backup for missed Stripe webhooks. The signed webhook remains the primary path.
export default async () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("[reconcile-stripe-orders] Stripe is not configured");
    return;
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: orders, error } = await getSupabaseAdmin().from("orders")
    .select("id,payment_payload").eq("status", "pending").eq("payment_method", "stripe")
    .gte("created_at", since).order("created_at", { ascending: false }).limit(20);
  if (error) throw error;

  for (const order of orders || []) {
    const sessionId = (order.payment_payload as { checkout_session_id?: string } | null)?.checkout_session_id;
    if (!sessionId || !sessionId.startsWith("cs_live_")) continue;
    try {
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      if (!response.ok) throw new Error(`Stripe responded ${response.status}`);
      const session = await response.json() as Parameters<typeof confirmPaidOrder>[0];
      if (session.payment_status === "paid" && session.metadata?.order_id === order.id) {
        await confirmPaidOrder(session);
      }
    } catch (error) {
      console.error("[reconcile-stripe-orders] verification failed", order.id, error);
    }
  }
};

export const config: Config = { schedule: "*/10 * * * *" };
