import type { MerchantSummary } from "../../netlify/lib/merchant-summary";

export type MerchantOffer = {
  id: string;
  title: string;
  description: string;
  price_sar: number;
  image_url: string;
  product_kind: string;
  fulfillment_method: string;
  status: string;
  review_note?: string | null;
  preview_asset_ids?: string[];
};
export type MerchantOrderItem = {
  id: string;
  order_id: string;
  product_title: string;
  quantity: number;
  source: string;
  commission_percent: number;
  gross_cents: number;
  stripe_fee_cents: number | null;
  commission_cents: number | null;
  merchant_cents: number | null;
  status: string;
  paid_at: string | null;
  ready_at: string | null;
  fulfillment_note?: string | null;
  fulfillment_submitted_at: string | null;
  delivered_at: string | null;
  hold_reason: string | null;
  settlement_id: string | null;
};
export type MerchantSettlement = {
  id: string;
  gross_cents: number;
  transfer_fee_cents: number;
  paid_cents: number;
  reference: string;
  created_at: string;
};
type Application = { id: number; status: string; created_at: string } | null;
export type MerchantAccountData = {
  merchant: { id: string; status: string; referral_code: string };
  application: Application;
  offers: MerchantOffer[];
  items: MerchantOrderItem[];
  settlements: MerchantSettlement[];
  settings: { hold_days: number; minimum_payout_cents: number };
  summary?: MerchantSummary;
};
export type MerchantDashboardData =
  | MerchantAccountData
  | { merchant: null; application: Application };

export async function merchantApi<T = unknown>(
  body?: unknown,
  admin = false,
  signal?: AbortSignal
): Promise<T> {
  const token = localStorage.getItem("sb_access_token");
  const response = await fetch("/api/merchant" + (admin ? "?admin=true" : ""), {
    method: body ? "POST" : "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null)
    throw new Error(
      data?.error || "Unable to reach the merchant service. Please retry."
    );
  return data as T;
}
export const money = (
  cents: number | null | undefined,
  lang: "ar" | "en" = "ar"
) =>
  cents == null
    ? lang === "ar"
      ? "بانتظار الرسوم"
      : "Fees pending"
    : new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
        style: "currency",
        currency: "SAR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(cents) / 100);
export const partnerStatus: Record<string, string> = {
  new: "قيد مراجعة الطلب",
  approved: "معتمد",
  rejected: "مرفوض",
  active: "نشط",
  suspended: "موقوف",
  draft: "مسودة",
  review: "قيد المراجعة",
  published: "منشور",
  pending: "بانتظار الدفع",
  fee_pending: "بانتظار احتساب رسوم الدفع",
  ready: "احتساب مكتمل",
  held: "معلّق للمراجعة",
  settled: "تمت التسوية",
};
const englishStatus: Record<string, string> = {
  new: "Application under review",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  suspended: "Suspended",
  draft: "Draft",
  review: "Under review",
  published: "Published",
  pending: "Awaiting payment",
  fee_pending: "Payment fees pending",
  ready: "Calculation complete",
  held: "On hold for review",
  settled: "Settled",
};
export const partnerStatusLabel = (status: string, lang: "ar" | "en") =>
  (lang === "ar" ? partnerStatus : englishStatus)[status] || status;
