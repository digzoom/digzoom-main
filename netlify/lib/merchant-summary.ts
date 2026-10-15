import type { getSupabaseAdmin } from "./supabase-admin";

/** All amounts are integer SAR cents; counts cover the complete merchant ledger. */
export interface MerchantSummary {
  offer_count: number;
  /** Product-order entries, rather than distinct customer orders. */
  order_count: number;
  settlement_count: number;
  /** Otherwise-ready proceeds, even while merchant-wide payout is blocked. */
  ready_cents: number;
  /** Ready proceeds after merchant-wide suspension/hold checks, before the minimum. */
  eligible_cents: number;
  /** Known proceeds awaiting delivery and/or the hold period, counted only once. */
  pending_cents: number;
  /** Known, unsettled held proceeds; see unknown_held_count for incomplete amounts. */
  held_cents: number;
  /** Historical paid_cents from recorded settlements, after transfer fees. */
  settled_cents: number;
  fee_pending_count: number;
  unknown_held_count: number;
  pending_delivery_count: number;
  pending_hold_count: number;
  payout_blocked: boolean;
  payout_block_reason: "held" | "suspended" | null;
  evaluated_at: string;
}

interface SummaryItem {
  id: string;
  status: string;
  merchant_cents: number | string | null;
  paid_at: string | null;
  ready_at: string | null;
  delivered_at: string | null;
  settlement_id: string | null;
  orders: { status: string } | null;
}

interface SummarySettlement {
  id: string;
  paid_cents: number | string;
}

type SummaryDatabase = Pick<ReturnType<typeof getSupabaseAdmin>, "from">;
const PAGE_SIZE = 500;
// A large ledger must fail visibly rather than silently show a partial balance.
const MAX_PAGES = 100;
const MAX_ROWS = PAGE_SIZE * MAX_PAGES;
const PAID_ORDER_STATUSES = new Set(["paid", "processing", "completed"]);

function cents(value: number | string): number {
  if (typeof value !== "number" && !/^\d+$/.test(value))
    throw new Error("Invalid merchant amount");
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount < 0)
    throw new Error("Invalid merchant amount");
  return amount;
}

function addCents(total: number, amount: number): number {
  const sum = total + amount;
  if (!Number.isSafeInteger(sum))
    throw new Error("Merchant balance exceeds safe precision");
  return sum;
}

function countRows(value: number | null): number {
  if (value === null || !Number.isSafeInteger(value) || value < 0)
    throw new Error("Incomplete merchant count");
  return value;
}

/** Do not derive balances from the capped, recent activity lists returned to the UI. */
export function buildMerchantSummary(
  merchantStatus: string,
  offerCount: number,
  items: SummaryItem[],
  settlements: SummarySettlement[],
  evaluatedAt = new Date()
): MerchantSummary {
  const summary: MerchantSummary = {
    offer_count: countRows(offerCount),
    order_count: items.length,
    settlement_count: settlements.length,
    ready_cents: 0,
    eligible_cents: 0,
    pending_cents: 0,
    held_cents: 0,
    settled_cents: 0,
    fee_pending_count: 0,
    unknown_held_count: 0,
    pending_delivery_count: 0,
    pending_hold_count: 0,
    payout_blocked: false,
    payout_block_reason: null,
    evaluated_at: evaluatedAt.toISOString(),
  };
  let hasHeldItem = false;

  for (const item of items) {
    // The settlement RPC blocks on *any* held row, including a previously settled refund.
    if (item.status === "held") hasHeldItem = true;
    if (item.settlement_id || item.status === "settled") continue;
    const amount =
      item.merchant_cents == null ? null : cents(item.merchant_cents);
    if (item.status === "held") {
      if (amount === null) summary.unknown_held_count++;
      else summary.held_cents = addCents(summary.held_cents, amount);
      continue;
    }
    // Match the parent-order status guard in record_merchant_settlement. A stale
    // ready row on a cancelled/refunded order is never an available balance.
    if (
      !item.paid_at ||
      !item.orders ||
      !PAID_ORDER_STATUSES.has(item.orders.status)
    )
      continue;
    if (
      item.status === "fee_pending" ||
      (item.status === "ready" && amount === null)
    ) {
      summary.fee_pending_count++;
      continue;
    }
    if (item.status !== "ready" || amount === null) continue;
    const awaitingDelivery = !item.delivered_at;
    const awaitingHold =
      !item.ready_at || !(Date.parse(item.ready_at) <= evaluatedAt.getTime());
    if (awaitingDelivery) summary.pending_delivery_count++;
    if (awaitingHold) summary.pending_hold_count++;
    if (awaitingDelivery || awaitingHold)
      summary.pending_cents = addCents(summary.pending_cents, amount);
    else summary.ready_cents = addCents(summary.ready_cents, amount);
  }

  for (const settlement of settlements) {
    summary.settled_cents = addCents(
      summary.settled_cents,
      cents(settlement.paid_cents)
    );
  }
  summary.payout_block_reason =
    merchantStatus !== "active" ? "suspended" : hasHeldItem ? "held" : null;
  summary.payout_blocked = summary.payout_block_reason !== null;
  summary.eligible_cents = summary.payout_blocked ? 0 : summary.ready_cents;
  return summary;
}

/**
 * Exact counts prevent a server row limit (even below PAGE_SIZE) from looking
 * like the end of the ledger. Stable ordering and duplicate/count checks reject
 * interrupted or shifting scans. This is a display snapshot, not authorization
 * to pay; the existing transactional settlement RPC remains authoritative.
 */
async function readAllMerchantRows<T extends { id: string }>(
  database: SummaryDatabase,
  table: "merchant_order_items" | "merchant_settlements",
  columns: string,
  merchantId: string,
  signal: AbortSignal
): Promise<T[]> {
  const rows: T[] = [];
  const seen = new Set<string>();
  let expected: number | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error, count } = await database
      .from(table)
      .select(columns, { count: "exact" })
      .eq("merchant_id", merchantId)
      .order("id", { ascending: true })
      .range(rows.length, rows.length + PAGE_SIZE - 1)
      .abortSignal(signal);
    if (error) throw error;
    const total = countRows(count);
    if (total > MAX_ROWS)
      throw new Error("Merchant summary exceeds scan limit");
    if (expected !== undefined && total !== expected)
      throw new Error("Merchant ledger changed during summary");
    expected = total;
    if (!Array.isArray(data) || rows.length + data.length > expected)
      throw new Error("Incomplete merchant summary");
    for (const row of data as unknown as T[]) {
      if (!row.id || seen.has(row.id))
        throw new Error("Duplicate merchant summary row");
      seen.add(row.id);
      rows.push(row);
    }
    if (rows.length === expected) return rows;
    if (!data.length) throw new Error("Incomplete merchant summary");
  }
  throw new Error("Merchant summary exceeds scan limit");
}

export async function loadMerchantSummary(
  database: SummaryDatabase,
  merchant: { id: string; status: string }
): Promise<MerchantSummary> {
  const evaluatedAt = new Date();
  const signal = AbortSignal.timeout(10000);
  const [offerResult, items, settlements] = await Promise.all([
    database
      .from("merchant_offers")
      .select("id", { count: "exact", head: true })
      .eq("merchant_id", merchant.id)
      .abortSignal(signal),
    readAllMerchantRows<SummaryItem>(
      database,
      "merchant_order_items",
      "id,status,merchant_cents,paid_at,ready_at,delivered_at,settlement_id,orders(status)",
      merchant.id,
      signal
    ),
    readAllMerchantRows<SummarySettlement>(
      database,
      "merchant_settlements",
      "id,paid_cents",
      merchant.id,
      signal
    ),
  ]);
  if (offerResult.error) throw offerResult.error;
  return buildMerchantSummary(
    merchant.status,
    countRows(offerResult.count),
    items,
    settlements,
    evaluatedAt
  );
}
