import type { Handler } from "@netlify/functions";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "../lib/supabase-admin";

function verifyStripeSignature(payload: Buffer, header: string, secret: string) {
  const fields = header.split(",").map((part) => part.split("=", 2));
  const timestamp = fields.find(([key]) => key === "t")?.[1];
  const signatures = fields.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload.toString("utf8")}`).digest("hex");
  return signatures.some((signature) => {
    if (signature.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers["stripe-signature"];
  if (!secretKey || !webhookSecret || !signature || !event.body) {
    return { statusCode: 400, body: "Webhook is not configured" };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : Buffer.from(event.body, "utf8");

  let stripeEvent: any;
  try {
    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) throw new Error("Signature mismatch");
    stripeEvent = JSON.parse(rawBody.toString("utf8"));
  } catch (error: any) {
    console.error("[stripe-webhook] invalid signature:", error?.message || error);
    return { statusCode: 400, body: "Invalid signature" };
  }

  const supabase = getSupabaseAdmin();
  if (stripeEvent.type === "checkout.session.completed" || stripeEvent.type === "checkout.session.async_payment_succeeded") {
    const session = stripeEvent.data.object as any;
    const orderId = session.metadata?.order_id;
    if (!orderId || session.payment_status !== "paid") {
      return { statusCode: 200, body: JSON.stringify({ received: true }) };
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("id,total_amount,status,coupon_id")
      .eq("id", orderId)
      .maybeSingle();
    if (error || !order) return { statusCode: 400, body: "Unknown order" };

    const expectedAmount = Math.round(Number(order.total_amount) * 100);
    if (session.currency !== "sar" || session.amount_total !== expectedAmount) {
      console.error("[stripe-webhook] amount mismatch", { orderId, expectedAmount, amount: session.amount_total, currency: session.currency });
      return { statusCode: 400, body: "Amount mismatch" };
    }

    const { data: paidOrders, error: paymentUpdateError } = await supabase.from("orders").update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_method: "stripe",
      payment_payload: {
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
      },
    }).eq("id", orderId).in("status", ["pending", "payment_failed"]).select("id");

    if (paymentUpdateError) {
      console.error("[stripe-webhook] order update failed", { orderId, message: paymentUpdateError.message });
      return { statusCode: 500, body: "Order update failed" };
    }

    // Stripe can retry webhooks. Count the coupon only on the first confirmed
    // payment so retries never consume extra uses.
    if (paidOrders?.length && order.coupon_id) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("used_count")
        .eq("id", order.coupon_id)
        .maybeSingle();
      if (coupon) {
        await supabase
          .from("coupons")
          .update({ used_count: Number(coupon.used_count || 0) + 1 })
          .eq("id", order.coupon_id);
      }
    }
  }

  if (stripeEvent.type === "checkout.session.expired") {
    const session = stripeEvent.data.object as any;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabase.from("orders").update({ status: "expired" }).eq("id", orderId).eq("status", "pending");
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true }),
  };
};
