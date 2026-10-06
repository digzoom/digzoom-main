import { createHmac } from "node:crypto";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  from: vi.fn(), holdMerchantCharge: vi.fn(), syncMerchantPayment: vi.fn(), fetch: vi.fn(),
}));
vi.mock("../netlify/lib/supabase-admin", () => ({ getSupabaseAdmin: () => ({ from: mocks.from }) }));
vi.mock("../netlify/lib/merchant-ledger", () => ({
  holdMerchantCharge: mocks.holdMerchantCharge, syncMerchantPayment: mocks.syncMerchantPayment,
}));

import { syncFullyRefundedOrder } from "../netlify/lib/order-refunds";
import { handler } from "../netlify/functions/stripe-webhook";

type Row = Record<string, unknown>;
type Order = Row & {
  id: string; status: string; total_amount: number; payment_method: string;
  payment_payload: { checkout_session_id?: string; payment_intent_id?: string; amount_total?: number; currency?: string };
};
type Result = { data: Row | Row[] | null; error: { message: string } | null };
const state = {
  orders: [] as Order[], ledger: [] as Row[], queries: [] as Query[], writes: [] as Row[],
  beforeWrite: undefined as (() => void) | undefined, readError: false, writeError: false,
};
function field(row: Row, key: string) {
  const [column, property] = key.split("->>");
  return property ? (row[column] as Row | undefined)?.[property] : row[column];
}
class Query {
  filters: ((row: Row) => boolean)[] = [];
  patch?: Row;
  constructor(readonly table: string) { state.queries.push(this); }
  select = vi.fn(() => this);
  eq = vi.fn((key: string, value: unknown) => { this.filters.push(row => field(row, key) === value); return this; });
  in = vi.fn((key: string, values: unknown[]) => { this.filters.push(row => values.includes(field(row, key))); return this; });
  contains = vi.fn((key: string, values: Row) => {
    this.filters.push(row => Object.entries(values).every(([name, value]) => (row[key] as Row | undefined)?.[name] === value));
    return this;
  });
  or = vi.fn((expression: string) => {
    const match = /^payment_payload->>payment_intent_id\.is\.null,payment_payload->>payment_intent_id\.eq\.(pi_[A-Za-z0-9]+)$/.exec(expression);
    if (!match) throw new Error(`Unexpected filter ${expression}`);
    this.filters.push(row => field(row, "payment_payload->>payment_intent_id") == null || field(row, "payment_payload->>payment_intent_id") === match[1]);
    return this;
  });
  update = vi.fn((patch: Row) => { this.patch = patch; return this; });
  maybeSingle = vi.fn(async () => this.execute(true));
  single = this.maybeSingle;
  then(resolve: (value: Result) => unknown, reject: (reason: unknown) => unknown) {
    return Promise.resolve().then(() => this.execute(false)).then(resolve, reject);
  }
  execute(single: boolean): Result {
    if ((this.patch && state.writeError) || (!this.patch && state.readError)) return { data: null, error: { message: "database unavailable" } };
    if (this.patch && this.table === "orders") {
      const callback = state.beforeWrite;
      state.beforeWrite = undefined;
      callback?.();
    }
    const source = this.table === "orders" ? state.orders : this.table === "merchant_order_items" ? state.ledger : [];
    const rows = source.filter(row => this.filters.every(filter => filter(row)));
    if (this.patch) {
      for (const row of rows) { Object.assign(row, this.patch); state.writes.push({ ...this.patch }); }
    }
    return { data: single ? structuredClone(rows[0] || null) : structuredClone(rows), error: null };
  }
}
function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "DZ-order", status: "paid", total_amount: 123.45, payment_method: "stripe", paid_at: "2026-10-01T00:00:00Z",
    payment_payload: { checkout_session_id: "cs_test_original", payment_intent_id: "pi_original", amount_total: 12345, currency: "sar" },
    ...overrides,
  };
}
function makeCharge(overrides: Row = {}) {
  return {
    object: "charge", id: "ch_original", paid: true, status: "succeeded", refunded: true,
    amount: 12345, amount_refunded: 12345, currency: "sar", payment_intent: "pi_original",
    metadata: { order_id: "DZ-order" }, ...overrides,
  };
}
function makeSession(overrides: Row = {}) {
  return {
    id: "cs_test_original", payment_status: "paid", amount_total: 12345, currency: "sar",
    payment_intent: "pi_original", metadata: { order_id: "DZ-order" }, ...overrides,
  };
}
function stripeResponse(session = makeSession()) {
  mocks.fetch.mockResolvedValue({ ok: true, json: async () => session });
}
function signedRequest(object: Row, type = "charge.refunded", options: { signature?: string; timestamp?: string; base64?: boolean; tamper?: boolean } = {}) {
  const body = JSON.stringify({ id: "evt_local", type, data: { object } });
  const timestamp = options.timestamp || String(Math.floor(Date.now() / 1000));
  const signature = options.signature ?? createHmac("sha256", "whsec_local_fixture").update(`${timestamp}.${body}`).digest("hex");
  const rawBody = options.tamper ? body.replace('"sar"', '"usd"') : body;
  return handler({
    rawUrl: "https://example.invalid/.netlify/functions/stripe-webhook", rawQuery: "", path: "/.netlify/functions/stripe-webhook",
    multiValueHeaders: {}, queryStringParameters: null, multiValueQueryStringParameters: null,
    httpMethod: "POST", headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    body: options.base64 ? Buffer.from(rawBody).toString("base64") : rawBody, isBase64Encoded: Boolean(options.base64),
  } as HandlerEvent, {} as HandlerContext, () => {});
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", mocks.fetch);
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_local_fixture");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_local_fixture");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("WHATSAPP_ACCESS_TOKEN", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
  state.orders = [makeOrder()]; state.ledger = []; state.queries = []; state.writes = [];
  state.beforeWrite = undefined; state.readError = false; state.writeError = false;
  mocks.from.mockImplementation((table: string) => new Query(table));
  mocks.fetch.mockRejectedValue(new Error("Unexpected network request"));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("verified full-refund order synchronization", () => {
  it("revokes only the exact paid order without changing payment evidence", async () => {
    state.orders.push(makeOrder({ id: "DZ-other", payment_payload: { checkout_session_id: "cs_test_other", payment_intent_id: "pi_other" } }));
    const originalPayload = structuredClone(state.orders[0].payment_payload);
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(true);
    expect(state.orders.map(order => order.status)).toEqual(["refunded", "paid"]);
    expect(state.orders[0].payment_payload).toEqual(originalPayload);
    expect(state.writes).toEqual([{ status: "refunded" }]);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each([
    { refunded: false, amount_refunded: 1234 }, { amount_refunded: 12344 }, { amount_refunded: 12346 },
    { amount: 12000, amount_refunded: 12000 }, { currency: "usd" }, { amount: 0, amount_refunded: 0 },
    { amount: 123.45, amount_refunded: 123.45 }, { paid: false }, { status: "failed" },
    { object: "refund" }, { payment_intent: null }, { id: "" },
  ])("does not revoke for partial, malformed, or mismatched charge %j", async (overrides) => {
    expect(await syncFullyRefundedOrder(makeCharge(overrides))).toBe(false);
    expect(state.orders[0].status).toBe("paid"); expect(state.writes).toEqual([]);
  });

  it.each(["refunded", "cancelled"])("preserves %s and repeated full refunds", async (status) => {
    state.orders[0].status = status;
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false);
    expect(state.orders[0].status).toBe(status); expect(state.writes).toEqual([]);
  });

  it("is idempotent across duplicate full refunds and a later old partial refund", async () => {
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(true);
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false);
    expect(await syncFullyRefundedOrder(makeCharge({ refunded: false, amount_refunded: 1 }))).toBe(false);
    expect(state.orders[0].status).toBe("refunded"); expect(state.writes).toHaveLength(1);
  });

  it("does not trust metadata when its candidate stores a different payment reference", async () => {
    expect(await syncFullyRefundedOrder(makeCharge({ payment_intent: "pi_other" }))).toBe(false);
    expect(state.writes).toEqual([]); expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("uses the stored payment identity despite conflicting editable charge metadata", async () => {
    state.orders.push(makeOrder({
      id: "DZ-other", payment_payload: { checkout_session_id: "cs_test_other", payment_intent_id: "pi_other" },
    }));
    expect(await syncFullyRefundedOrder(makeCharge({ metadata: { order_id: "DZ-other" } }))).toBe(true);
    expect(state.orders.map(order => order.status)).toEqual(["refunded", "paid"]);
    expect(state.writes).toEqual([{ status: "refunded" }]);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("matches a stored payment intent when charge metadata is absent or the reference is expanded", async () => {
    expect(await syncFullyRefundedOrder(makeCharge({ metadata: {}, payment_intent: { id: "pi_original" } }))).toBe(true);
  });

  it.each([
    { checkout_session_id: "cs_test_original", payment_intent_id: "pi_original", amount_total: 999 },
    { checkout_session_id: "cs_test_original", payment_intent_id: "pi_original", currency: "usd" },
    { payment_intent_id: "pi_original" },
  ])("rejects conflicting or incomplete stored payment evidence %j", async (payment_payload) => {
    state.orders[0].payment_payload = payment_payload;
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false); expect(state.writes).toEqual([]);
  });

  it("verifies the exact stored checkout session when a refund arrives before confirmation", async () => {
    state.orders[0] = makeOrder({ status: "pending", paid_at: null, payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse();
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(true);
    expect(state.orders[0].status).toBe("refunded");
    expect(mocks.fetch).toHaveBeenCalledOnce();
    expect(mocks.fetch).toHaveBeenCalledWith("https://api.stripe.com/v1/checkout/sessions/cs_test_original", expect.objectContaining({
      headers: { Authorization: "Bearer sk_test_local_fixture" },
    }));
  });

  it.each([
    { id: "cs_test_other" }, { payment_intent: "pi_other" }, { amount_total: 99 }, { currency: "usd" },
    { payment_status: "unpaid" }, { metadata: { order_id: "DZ-other" } },
  ])("rejects an early refund whose stored checkout cannot verify it %j", async (overrides) => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse(makeSession(overrides));
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false); expect(state.writes).toEqual([]);
  });

  it("does not scan Stripe or guess an order when no reference or metadata matches", async () => {
    state.orders[0].payment_payload = { checkout_session_id: "cs_test_original" };
    expect(await syncFullyRefundedOrder(makeCharge({ metadata: {} }))).toBe(false);
    expect(mocks.fetch).not.toHaveBeenCalled(); expect(state.writes).toEqual([]);
  });

  it.each(["cancelled", "refunded"])("does not overwrite a concurrent %s transition", async (status) => {
    state.beforeWrite = () => { state.orders[0].status = status; };
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false);
    expect(state.orders[0].status).toBe(status); expect(state.writes).toEqual([]);
  });

  it.each(["session", "intent", "amount", "method"])("does not revoke a concurrently replaced %s", async (replacement) => {
    state.beforeWrite = () => {
      if (replacement === "session") state.orders[0].payment_payload.checkout_session_id = "cs_test_other";
      if (replacement === "intent") state.orders[0].payment_payload.payment_intent_id = "pi_other";
      if (replacement === "amount") state.orders[0].total_amount = 999;
      if (replacement === "method") state.orders[0].payment_method = "manual";
    };
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(false); expect(state.writes).toEqual([]);
  });

  it("still revokes when the same checkout confirmation finishes during refund verification", async () => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse();
    state.beforeWrite = () => { state.orders[0] = makeOrder(); };
    expect(await syncFullyRefundedOrder(makeCharge())).toBe(true);
    expect(state.orders[0].status).toBe("refunded");
    expect(state.orders[0].payment_payload.payment_intent_id).toBe("pi_original");
  });
});

describe("signed refund webhook boundary", () => {
  it("applies a valid signature over the exact base64 body and retains merchant holds", async () => {
    expect(await signedRequest(makeCharge(), "charge.refunded", { base64: true })).toMatchObject({ statusCode: 200 });
    expect(state.orders[0].status).toBe("refunded");
    expect(mocks.holdMerchantCharge).toHaveBeenCalledWith(makeCharge(), "charge.refunded");
  });

  it.each([
    { signature: "0".repeat(64) }, { signature: "g".repeat(64) }, { timestamp: "NaN" },
    { timestamp: "1" }, { tamper: true },
  ])("rejects forged, malformed, stale, or altered events %j", async (options) => {
    expect(await signedRequest(makeCharge(), "charge.refunded", options)).toMatchObject({ statusCode: 400 });
    expect(mocks.from).not.toHaveBeenCalled(); expect(mocks.holdMerchantCharge).not.toHaveBeenCalled();
  });

  it("keeps partial-refund downloads eligible while still holding merchant funds", async () => {
    const partial = makeCharge({ refunded: false, amount_refunded: 1234 });
    expect(await signedRequest(partial)).toMatchObject({ statusCode: 200 });
    expect(state.orders[0].status).toBe("paid"); expect(state.writes).toEqual([]);
    expect(mocks.holdMerchantCharge).toHaveBeenCalledWith(partial, "charge.refunded");
  });

  it("keeps dispute handling as a merchant hold without refunding the customer order", async () => {
    expect(await signedRequest({ charge: "ch_original", payment_intent: "pi_original" }, "charge.dispute.created")).toMatchObject({ statusCode: 200 });
    expect(state.orders[0].status).toBe("paid"); expect(state.writes).toEqual([]);
    expect(mocks.holdMerchantCharge).toHaveBeenCalledWith({ charge: "ch_original", payment_intent: "pi_original" }, "charge.dispute.created");
  });

  it.each(["checkout.session.completed", "checkout.session.async_payment_succeeded"])("cannot resurrect an early full refund with a delayed %s", async (type) => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse();
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 200 });
    expect(await signedRequest(makeSession(), type)).toMatchObject({ statusCode: 200 });
    expect(state.orders[0].status).toBe("refunded"); expect(state.writes).toEqual([{ status: "refunded" }]);
    expect(mocks.syncMerchantPayment).not.toHaveBeenCalled();
  });

  it("returns a retryable error on database failure without revoking access", async () => {
    state.writeError = true;
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 500, body: "Order refund sync failed" });
    expect(state.orders[0].status).toBe("paid");
  });

  it("returns a retryable error when Stripe cannot verify an early refund", async () => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    mocks.fetch.mockResolvedValue({ ok: false, status: 503 });
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 500, body: "Order refund sync failed" });
    expect(state.orders[0].status).toBe("pending"); expect(state.writes).toEqual([]);
  });

  it("retains the existing retryable failure when the merchant hold fails", async () => {
    mocks.holdMerchantCharge.mockRejectedValueOnce(new Error("hold failed"));
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 500, body: "Merchant hold failed" });
    expect(state.writes).toEqual([]);
  });
});


describe("signed webhook with the real merchant hold helper", () => {
  beforeEach(async () => {
    const actual = await vi.importActual<typeof import("../netlify/lib/merchant-ledger")>("../netlify/lib/merchant-ledger");
    mocks.holdMerchantCharge.mockImplementation(actual.holdMerchantCharge);
    state.orders.push(makeOrder({
      id: "DZ-other", payment_payload: { checkout_session_id: "cs_test_other", payment_intent_id: "pi_other" },
    }));
    state.ledger = [
      { id: "ledger-original", order_id: "DZ-order", status: "ready", gross_cents: 12345 },
      { id: "ledger-other", order_id: "DZ-other", status: "ready", gross_cents: 12345 },
    ];
  });

  it("refunds and holds A only when the authentic charge for A has editable metadata pointing to B", async () => {
    expect(await signedRequest(makeCharge({ metadata: { order_id: "DZ-other" } }))).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["refunded", "paid"]);
    expect(state.ledger).toEqual([
      { id: "ledger-original", order_id: "DZ-order", status: "held", hold_reason: "charge.refunded", gross_cents: 12345 },
      { id: "ledger-other", order_id: "DZ-other", status: "ready", gross_cents: 12345 },
    ]);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("holds only A on a partial refund without revoking either order", async () => {
    expect(await signedRequest(makeCharge({ refunded: false, amount_refunded: 100, metadata: { order_id: "DZ-other" } }))).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["paid", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["held", "ready"]);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each(["charge.dispute.created", "charge.dispute.closed"])("preserves the exact payment's hold for %s", async (type) => {
    expect(await signedRequest({ payment_intent: "pi_original", charge: "ch_original" }, type)).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["paid", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["held", "ready"]);
    expect(state.ledger[0].hold_reason).toBe(type);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("retrieves only the exact disputed charge when the event omits its payment intent", async () => {
    mocks.fetch.mockResolvedValue({ ok: true, json: async () => makeCharge({ metadata: { order_id: "DZ-other" } }) });
    expect(await signedRequest({ charge: "ch_original" }, "charge.dispute.created")).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["paid", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["held", "ready"]);
    expect(mocks.fetch).toHaveBeenCalledWith("https://api.stripe.com/v1/charges/ch_original", expect.any(Object));
    expect(mocks.fetch).toHaveBeenCalledOnce();
  });

  it("verifies the stored checkout before holding and revoking an early refunded order", async () => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse();
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["refunded", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["held", "ready"]);
    for (const [url] of mocks.fetch.mock.calls) expect(url).toBe("https://api.stripe.com/v1/checkout/sessions/cs_test_original");
  });

  it("verifies an early disputed order through its exact charge and stored checkout", async () => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    mocks.fetch.mockResolvedValueOnce({ ok: true, json: async () => makeCharge() })
      .mockResolvedValueOnce({ ok: true, json: async () => makeSession() });
    expect(await signedRequest({ charge: "ch_original", payment_intent: "pi_original" }, "charge.dispute.created")).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["pending", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["held", "ready"]);
    expect(mocks.fetch.mock.calls.map(([url]) => url)).toEqual([
      "https://api.stripe.com/v1/charges/ch_original", "https://api.stripe.com/v1/checkout/sessions/cs_test_original",
    ]);
  });

  it("does not hold a metadata-selected early order if its stored session belongs to a different payment", async () => {
    state.orders[0] = makeOrder({ status: "pending", payment_payload: { checkout_session_id: "cs_test_original" } });
    stripeResponse(makeSession({ payment_intent: "pi_different" }));
    expect(await signedRequest(makeCharge())).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["pending", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["ready", "ready"]);
    expect(state.writes).toEqual([]);
  });

  it("does not redirect a hold based on metadata alone when no stored payment matches", async () => {
    expect(await signedRequest(makeCharge({ payment_intent: "pi_unknown", metadata: { order_id: "DZ-other" } }))).toMatchObject({ statusCode: 200 });
    expect(state.orders.map(order => order.status)).toEqual(["paid", "paid"]);
    expect(state.ledger.map(row => row.status)).toEqual(["ready", "ready"]);
    expect(state.writes).toEqual([]); expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("does not trust a retrieved dispute charge that conflicts with the signed event's payment intent", async () => {
    mocks.fetch.mockResolvedValue({ ok: true, json: async () => makeCharge({ payment_intent: "pi_other" }) });
    expect(await signedRequest({ charge: "ch_original", payment_intent: "pi_unknown" }, "charge.dispute.created")).toMatchObject({ statusCode: 200 });
    expect(state.ledger.map(row => row.status)).toEqual(["ready", "ready"]); expect(state.writes).toEqual([]);
  });
});
