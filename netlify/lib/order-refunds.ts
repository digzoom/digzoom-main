import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "./supabase-admin";

type StripeRefundedCharge = {
  object?: string;
  id?: string;
  paid?: boolean;
  status?: string;
  refunded?: boolean;
  amount?: number;
  amount_refunded?: number;
  currency?: string;
  payment_intent?: string | { id?: string } | null;
  metadata?: { order_id?: string };
};

type RefundOrder = {
  id: string;
  total_amount: number | string;
  status: string;
  payment_method?: string;
  payment_payload?: {
    checkout_session_id?: string;
    payment_intent_id?: string;
    amount_total?: number;
    currency?: string;
  } | null;
};

const refundableStatuses = ["pending", "paid", "processing", "completed"];
const orderColumns = "id,total_amount,status,payment_method,payment_payload";

/** Resolve only a stored payment identity or an exact Stripe-verified stored checkout. */
export async function resolveStripeChargeOrder(charge: StripeRefundedCharge): Promise<RefundOrder | null> {
  const paymentIntent = typeof charge.payment_intent === "string"
    ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntent || !/^pi_[A-Za-z0-9]+$/.test(paymentIntent)) return null;
  // Prefer the verified payment reference already saved by order confirmation.
  const db = getSupabaseAdmin() as SupabaseClient;
  const { data: matchedOrder, error } = await db.from("orders").select(orderColumns)
    .contains("payment_payload", { payment_intent_id: paymentIntent }).maybeSingle();
  if (error) throw new Error("Unable to find Stripe payment");
  let order: RefundOrder | null = matchedOrder;
  if (!order && charge.metadata?.order_id) {
    // Metadata only locates a candidate; it never authorizes a status change.
    const { data, error: candidateError } = await db.from("orders").select(orderColumns)
      .eq("id", charge.metadata.order_id).maybeSingle();
    if (candidateError) throw new Error("Unable to find Stripe order");
    order = data;
  }
  if (!order || order.payment_method !== "stripe") return null;
  // Stripe metadata is editable. A conflicting hint must neither redirect nor
  // veto the exact payment identity already verified and stored on the order.
  if (!matchedOrder && charge.metadata?.order_id !== order.id) return null;
  const expectedAmount = Math.round(Number(order.total_amount) * 100);
  const payload = order.payment_payload;
  const sessionId = payload?.checkout_session_id;
  if (!Number.isSafeInteger(expectedAmount) || expectedAmount <= 0 ||
      (charge.amount != null && expectedAmount !== charge.amount) ||
      (charge.currency != null && charge.currency !== "sar") ||
      !sessionId || !/^cs_(?:test_|live_)?[A-Za-z0-9]+$/.test(sessionId) ||
      (payload?.payment_intent_id && payload.payment_intent_id !== paymentIntent) ||
      (payload?.amount_total != null && payload.amount_total !== expectedAmount) ||
      (payload?.currency != null && payload.currency !== "sar")) return null;

  if (!payload?.payment_intent_id) {
    // Refund webhooks can arrive before checkout completion. Verify only the exact
    // stored session, never an account-wide list or a metadata-only association.
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Unable to verify Stripe checkout");
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Unable to verify Stripe checkout");
    const session = await response.json() as {
      id?: string; payment_status?: string; amount_total?: number; currency?: string;
      payment_intent?: string | { id?: string } | null; metadata?: { order_id?: string };
    };
    const sessionPaymentIntent = typeof session.payment_intent === "string"
      ? session.payment_intent : session.payment_intent?.id;
    if (session.id !== sessionId || session.payment_status !== "paid" ||
        session.metadata?.order_id !== order.id || sessionPaymentIntent !== paymentIntent ||
        session.amount_total !== expectedAmount || session.currency !== "sar") return null;
  }

  return order;
}

/** Only call with a charge.refunded object from a signature-verified Stripe event. */
export async function syncFullyRefundedOrder(charge: StripeRefundedCharge): Promise<boolean> {
  const paymentIntent = typeof charge.payment_intent === "string"
    ? charge.payment_intent : charge.payment_intent?.id;
  // Partial refunds still hold the merchant ledger, but do not revoke customer access.
  if (charge.object !== "charge" || !/^ch_[A-Za-z0-9]+$/.test(charge.id || "") ||
      !paymentIntent || !/^pi_[A-Za-z0-9]+$/.test(paymentIntent) ||
      charge.paid !== true || charge.status !== "succeeded" || charge.refunded !== true ||
      !Number.isSafeInteger(charge.amount) || (charge.amount ?? 0) <= 0 ||
      charge.amount_refunded !== charge.amount || charge.currency !== "sar") return false;

  const order = await resolveStripeChargeOrder(charge);
  if (!order || !refundableStatuses.includes(order.status)) return false;
  const sessionId = order.payment_payload!.checkout_session_id!;
  const db = getSupabaseAdmin() as SupabaseClient;

  // Change only status. These write-time guards let a concurrent confirmation
  // finish first, but cannot overwrite a cancellation or a replacement payment.
  // A duplicate or older partial-refund event cannot restore a revoked order.
  const { data: updated, error: updateError } = await db.from("orders")
    .update({ status: "refunded" }).eq("id", order.id)
    .eq("total_amount", order.total_amount)
    .eq("payment_method", "stripe")
    .eq("payment_payload->>checkout_session_id", sessionId)
    .or(`payment_payload->>payment_intent_id.is.null,payment_payload->>payment_intent_id.eq.${paymentIntent}`)
    .in("status", refundableStatuses).select("id");
  if (updateError) throw new Error("Order refund update failed");
  return Boolean(updated?.length);
}
