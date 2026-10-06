import type { Handler } from "@netlify/functions";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "../lib/supabase-admin";
import { holdMerchantCharge } from "../lib/merchant-ledger";
import { confirmPaidOrder } from "../lib/order-confirmation";
import { syncFullyRefundedOrder } from "../lib/order-refunds";

type StripeEvent = {
  type: string;
  data: { object: Parameters<typeof confirmPaidOrder>[0] & Parameters<typeof syncFullyRefundedOrder>[0] & { charge?: string } };
};

function verifyStripeSignature(payload: Buffer, header: string, secret: string) {
  const fields = header.split(",").map((part) => part.split("=", 2));
  const timestamp = fields.find(([key]) => key === "t")?.[1];
  const signatures = fields.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || !Number.isSafeInteger(Number(timestamp)) || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload.toString("utf8")}`).digest("hex");
  return signatures.some((signature) => {
    if (!/^[a-fA-F0-9]{64}$/.test(signature)) return false;
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

  let stripeEvent: StripeEvent;
  try {
    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) throw new Error("Signature mismatch");
    stripeEvent = JSON.parse(rawBody.toString("utf8"));
  } catch (error) {
    console.error("[stripe-webhook] invalid signature:", error instanceof Error ? error.message : error);
    return { statusCode: 400, body: "Invalid signature" };
  }

  if (stripeEvent.type === "checkout.session.completed" || stripeEvent.type === "checkout.session.async_payment_succeeded") {
    const session = stripeEvent.data.object;
    try {
      await confirmPaidOrder(session);
    } catch (error) {
      console.error("[stripe-webhook] order confirmation failed", session.metadata?.order_id, error);
      return { statusCode: 500, body: "Order confirmation failed" };
    }
  }

  if (["charge.refunded", "charge.dispute.created", "charge.dispute.closed"].includes(stripeEvent.type)) {
    try {
      const object = stripeEvent.data.object;
      await holdMerchantCharge(stripeEvent.type.startsWith("charge.dispute") ? {payment_intent: object.payment_intent,charge:object.charge} : object, stripeEvent.type);
    } catch { return {statusCode: 500, body: "Merchant hold failed"}; }
  }

  if (stripeEvent.type === "charge.refunded") {
    try {
      await syncFullyRefundedOrder(stripeEvent.data.object);
    } catch (error) {
      console.error("[stripe-webhook] order refund sync failed", stripeEvent.data.object?.id, error);
      return { statusCode: 500, body: "Order refund sync failed" };
    }
  }

  if (stripeEvent.type === "checkout.session.expired") {
    const session = stripeEvent.data.object;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      const db = getSupabaseAdmin() as SupabaseClient;
      await db.from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true }),
  };
};
