import { describe, expect, it, vi } from "vitest";
import {
  buildMerchantSummary,
  loadMerchantSummary,
} from "../netlify/lib/merchant-summary";

const now = new Date("2026-10-15T00:00:00Z");
const item = (
  overrides: Partial<Parameters<typeof buildMerchantSummary>[2][number]> = {}
) => ({
  id: "one",
  status: "ready",
  merchant_cents: 85000,
  paid_at: "2026-10-01T00:00:00Z",
  ready_at: now.toISOString(),
  delivered_at: "2026-10-02T00:00:00Z",
  settlement_id: null,
  orders: { status: "paid" },
  ...overrides,
});

describe("complete seller balance summary", () => {
  it("includes histories beyond recent API caps without recomputing commission", () => {
    const items = Array.from({ length: 601 }, (_, i) =>
      item({ id: String(i), merchant_cents: "1" })
    );
    const settlements = Array.from({ length: 120 }, (_, i) => ({
      id: String(i),
      paid_cents: "99",
    }));
    const result = buildMerchantSummary("active", 250, items, settlements, now);
    expect(result).toMatchObject({
      offer_count: 250,
      order_count: 601,
      settlement_count: 120,
      ready_cents: 601,
      eligible_cents: 601,
      settled_cents: 11880,
      payout_blocked: false,
    });
  });
  it("distinguishes known pending proceeds and unknown fees without double counting", () => {
    const result = buildMerchantSummary(
      "active",
      0,
      [
        item(),
        item({
          id: "pending",
          delivered_at: null,
          ready_at: "2026-10-16T00:00:00Z",
          merchant_cents: 100,
        }),
        item({ id: "fee", status: "fee_pending", merchant_cents: null }),
        item({
          id: "unpaid",
          status: "pending",
          paid_at: null,
          merchant_cents: null,
        }),
        item({ id: "cancelled", orders: { status: "cancelled" } }),
        item({ id: "refunded", orders: { status: "refunded" } }),
        item({ id: "settled", settlement_id: "settlement", status: "settled" }),
      ],
      [],
      now
    );
    expect(result).toMatchObject({
      eligible_cents: 85000,
      pending_cents: 100,
      pending_delivery_count: 1,
      pending_hold_count: 1,
      fee_pending_count: 1,
    });
  });
  it("blocks all payout on a held item without losing other ready proceeds", () => {
    const result = buildMerchantSummary(
      "active",
      0,
      [
        item(),
        item({ id: "held", status: "held", merchant_cents: 500 }),
        item({ id: "unknown", status: "held", merchant_cents: null }),
      ],
      [],
      now
    );
    expect(result).toMatchObject({
      ready_cents: 85000,
      eligible_cents: 0,
      held_cents: 500,
      unknown_held_count: 1,
      payout_blocked: true,
      payout_block_reason: "held",
    });
  });
  it("blocks suspended merchants and post-settlement disputes without double counting historical transfers", () => {
    const result = buildMerchantSummary(
      "suspended",
      0,
      [
        item(),
        item({ id: "held-settled", status: "held", settlement_id: "s" }),
      ],
      [{ id: "s", paid_cents: 84000 }],
      now
    );
    expect(result).toMatchObject({
      ready_cents: 85000,
      eligible_cents: 0,
      held_cents: 0,
      settled_cents: 84000,
      payout_block_reason: "suspended",
    });
    expect(
      buildMerchantSummary(
        "active",
        0,
        [item({ status: "held", settlement_id: "s" })],
        [],
        now
      ).payout_block_reason
    ).toBe("held");
  });
  it("does not make unknown or malformed hold dates eligible", () => {
    expect(
      buildMerchantSummary(
        "active",
        0,
        [item({ ready_at: "invalid" }), item({ id: "null", ready_at: null })],
        [],
        now
      )
    ).toMatchObject({ eligible_cents: 0, pending_cents: 170000 });
  });
  it("fails closed on invalid amounts or unsafe totals", () => {
    expect(() =>
      buildMerchantSummary("active", 0, [item({ merchant_cents: -1 })], [], now)
    ).toThrow();
    expect(() =>
      buildMerchantSummary(
        "active",
        0,
        [item({ merchant_cents: Number.MAX_SAFE_INTEGER }), item()],
        [],
        now
      )
    ).toThrow();
  });
});

function database(
  options: {
    cap?: number;
    error?: boolean;
    changedCount?: boolean;
    duplicate?: boolean;
    total?: number;
  } = {}
) {
  const rows = Array.from({ length: options.total ?? 503 }, (_, i) =>
    item({ id: `row-${i}`, merchant_cents: 1 })
  );
  const filters: unknown[][] = [];
  const ranges: number[][] = [];
  const from = vi.fn((table: string) => {
    let offset = 0,
      end = 0;
    const chain = {
      select: vi.fn(() => chain),
      eq: vi.fn((...args: unknown[]) => {
        filters.push(args);
        return chain;
      }),
      order: vi.fn(() => chain),
      range: vi.fn((start: number, last: number) => {
        offset = start;
        end = last;
        ranges.push([start, last]);
        return chain;
      }),
      abortSignal: vi.fn(() => chain),
      then: (resolve: (value: unknown) => unknown) => {
        if (table === "merchant_offers")
          return Promise.resolve(resolve({ count: 205, error: null }));
        if (table === "merchant_settlements")
          return Promise.resolve(resolve({ data: [], count: 0, error: null }));
        const data = rows.slice(
          options.duplicate && offset ? 0 : offset,
          options.duplicate && offset
            ? 1
            : Math.min(end + 1, offset + (options.cap ?? 500))
        );
        return Promise.resolve(
          resolve({
            data,
            count: rows.length + (options.changedCount && offset ? 1 : 0),
            error: options.error ? new Error("read failed") : null,
          })
        );
      },
    };
    return chain;
  });
  return {
    db: { from } as unknown as Parameters<typeof loadMerchantSummary>[0],
    filters,
    ranges,
  };
}

describe("paged merchant summary retrieval", () => {
  it("reads every row when the database imposes a smaller page cap and scopes every query to the verified merchant", async () => {
    const { db, filters, ranges } = database({ cap: 100 });
    const summary = await loadMerchantSummary(db, {
      id: "verified-merchant",
      status: "active",
    });
    expect(summary.order_count).toBe(503);
    expect(summary.ready_cents).toBe(503);
    expect(summary.offer_count).toBe(205);
    expect(ranges).toContainEqual([500, 999]);
    expect(
      filters.every(
        filter =>
          filter[0] === "merchant_id" && filter[1] === "verified-merchant"
      )
    ).toBe(true);
  });
  it.each([{ error: true }, { changedCount: true }, { duplicate: true }])(
    "rejects incomplete reads instead of returning misleading totals: %j",
    async options => {
      await expect(
        loadMerchantSummary(database(options).db, { id: "m", status: "active" })
      ).rejects.toThrow();
    }
  );
});
