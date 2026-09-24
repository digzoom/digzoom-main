import type { Handler } from "@netlify/functions";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { confirmPaidOrder } from "../lib/order-confirmation";

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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers["stripe-signature"];
  if (!webhookSecret || !signature || !event.body) {
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

  if (stripeEvent.type === "checkout.session.completed" || stripeEvent.type === "checkout.session.async_payment_succeeded") {
    const session = stripeEvent.data.object as any;
    try {
      await confirmPaidOrder(session);
    } catch (error) {
      console.error("[stripe-webhook] order confirmation failed", session.metadata?.order_id, error);
      return { statusCode: 500, body: "Order confirmation failed" };
    }
  }

  if (stripeEvent.type === "checkout.session.expired") {
    const session = stripeEvent.data.object as any;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await getSupabaseAdmin().from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true }),
  };
};
