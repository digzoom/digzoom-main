import { getSupabaseAdmin } from "./supabase-admin";

type StripeSession = {
  id: string;
  payment_status?: string;
  amount_total?: number;
  currency?: string;
  payment_intent?: string | null;
  metadata?: { order_id?: string };
};

function html(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] || character);
}

async function notifyOwner(order: any, items: any[]) {
  const details = items.map((item) => `${item.product_title} × ${item.quantity}`).join("، ");
  const emailKey = process.env.RESEND_API_KEY;
  if (emailKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `digzoom-paid-order-${order.id}`,
      },
      body: JSON.stringify({
        from: process.env.ORDER_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "DigZoom <contact@digzoom.com>",
        to: [process.env.ORDER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "info@digzoom.com"],
        subject: `طلب مدفوع جديد ${order.id} — ${order.total_amount} ر.س`,
        html: `<h2>طلب مدفوع جديد</h2><p>رقم الطلب: ${html(order.id)}</p><p>العميل: ${html(order.customer_name)}</p><p>البريد: ${html(order.customer_email)}</p><p>الجوال: ${html(order.customer_phone)}</p><p>المنتجات: ${html(details)}</p><p>المبلغ: ${html(order.total_amount)} ر.س</p><p>افتح لوحة إدارة DigZoom لمتابعة الطلب.</p>`,
      }),
    });
    if (!response.ok) console.error("[order-notification] email failed", order.id, response.status);
  } else {
    console.warn("[order-notification] RESEND_API_KEY missing", order.id);
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.ORDER_WHATSAPP_TO;
  const template = process.env.ORDER_WHATSAPP_TEMPLATE;
  if (token && phoneId && recipient && template) {
    // An approved utility template with three body parameters is required:
    // order number, amount, and product summary.
    const response = await fetch(`https://graph.facebook.com/v23.0/${encodeURIComponent(phoneId)}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to: recipient, type: "template",
        template: {
          name: template, language: { code: process.env.ORDER_WHATSAPP_LANGUAGE || "ar" },
          components: [{ type: "body", parameters: [
            { type: "text", text: order.id },
            { type: "text", text: `${order.total_amount} SAR` },
            { type: "text", text: details.slice(0, 200) || "DigZoom" },
          ] }],
        },
      }),
    });
    if (!response.ok) console.error("[order-notification] WhatsApp failed", order.id, response.status);
  }
}

/** Shared by the signed Stripe webhook and a Stripe-verified return from Checkout. */
export async function confirmPaidOrder(session: StripeSession) {
  const orderId = session.metadata?.order_id;
  if (!orderId || session.payment_status !== "paid") return false;
  // The checkout schema lives in Supabase migrations; this server-only client
  // uses the same ungenerated table typing as the existing admin router.
  const supabase: any = getSupabaseAdmin();
  const { data: order, error } = await supabase.from("orders")
    .select("id,total_amount,status,coupon_id,customer_name,customer_email,customer_phone,payment_payload")
    .eq("id", orderId).maybeSingle();
  if (error || !order) throw new Error("Unknown order");
  if (session.currency?.toLowerCase() !== "sar" || session.amount_total !== Math.round(Number(order.total_amount) * 100) ||
      order.payment_payload?.checkout_session_id !== session.id) throw new Error("Checkout session mismatch");

  const { data: paidOrders, error: updateError } = await supabase.from("orders").update({
    status: "paid", paid_at: new Date().toISOString(), payment_method: "stripe",
    payment_payload: { checkout_session_id: session.id, payment_intent_id: session.payment_intent,
      amount_total: session.amount_total, currency: session.currency },
  }).eq("id", orderId).eq("status", "pending").select("id");
  if (updateError) throw new Error("Order payment update failed");
  if (!paidOrders?.length) return true;

  if (order.coupon_id) {
    const { data: coupon } = await supabase.from("coupons").select("used_count").eq("id", order.coupon_id).maybeSingle();
    if (coupon) await supabase.from("coupons").update({ used_count: Number(coupon.used_count || 0) + 1 }).eq("id", order.coupon_id);
  }
  try {
    const { data: items } = await supabase.from("order_items")
      .select("product_title,quantity").eq("order_id", orderId);
    await notifyOwner(order, items || []);
  } catch (notificationError) {
    // A notification outage must not undo a confirmed payment.
    console.error("[order-notification] delivery error", orderId, notificationError);
  }
  return true;
}
