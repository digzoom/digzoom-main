import { beforeEach, describe, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({
  user: undefined as { id: string; role: string } | undefined,
  from: vi.fn(),
  summary: vi.fn(),
}));
vi.mock("../netlify/lib/trpc", () => ({
  verifySupabaseToken: vi.fn(async () => mock.user),
}));
vi.mock("../netlify/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({ from: mock.from }),
}));
vi.mock("../netlify/lib/merchant-summary", () => ({
  loadMerchantSummary: mock.summary,
}));
import { handler } from "../netlify/functions/merchant";
const merchant = {
  id: "verified-merchant",
  user_id: "verified-user",
  status: "active",
};
function chain(data: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    maybeSingle: vi.fn(async () => ({ data, error: null })),
    single: vi.fn(async () => ({ data, error: null })),
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve(resolve({ data, error: null })),
  };
  return query;
}
function request(parameters: Record<string, string> = {}) {
  return handler(
    {
      httpMethod: "GET",
      headers: { authorization: "Bearer test" },
      queryStringParameters: parameters,
    } as never,
    {} as never,
    () => {}
  ) as Promise<{ statusCode: number; body: string }>;
}
beforeEach(() => {
  mock.user = { id: "verified-user", role: "user" };
  mock.from.mockReset();
  mock.summary.mockReset();
});
describe("seller dashboard read authorization and summary", () => {
  it("scopes full totals and recent lists to the authenticated seller, ignoring supplied merchant identifiers", async () => {
    const merchants = chain(merchant);
    const rows: ReturnType<typeof chain>[] = [];
    mock.from.mockImplementation((table: string) => {
      if (table === "merchants") return merchants;
      const query = chain(
        table === "partner_applications"
          ? null
          : table === "merchant_settings"
            ? { hold_days: 14, minimum_payout_cents: 100000 }
            : []
      );
      if (
        [
          "merchant_offers",
          "merchant_order_items",
          "merchant_settlements",
        ].includes(table)
      )
        rows.push(query);
      return query;
    });
    mock.summary.mockResolvedValue({
      offer_count: 999,
      eligible_cents: 123456,
    });
    const response = await request({ merchant_id: "victim" });
    expect(response.statusCode).toBe(200);
    expect(merchants.eq).toHaveBeenCalledWith("user_id", "verified-user");
    for (const query of rows)
      expect(query.eq).toHaveBeenCalledWith("merchant_id", "verified-merchant");
    expect(mock.summary).toHaveBeenCalledWith(expect.anything(), merchant);
    expect(JSON.parse(response.body).summary).toMatchObject({
      offer_count: 999,
      eligible_cents: 123456,
    });
  });
  it("fails visibly when a complete balance cannot be established", async () => {
    mock.from.mockImplementation((table: string) =>
      chain(
        table === "merchants"
          ? merchant
          : table === "partner_applications"
            ? null
            : []
      )
    );
    mock.summary.mockRejectedValue(new Error("Incomplete merchant summary"));
    expect((await request()).statusCode).toBe(400);
  });
  it("returns only application state before merchant approval", async () => {
    mock.from.mockImplementation((table: string) =>
      chain(table === "merchants" ? null : { id: 1, status: "new" })
    );
    const response = await request();
    expect(JSON.parse(response.body)).toEqual({
      merchant: null,
      application: { id: 1, status: "new" },
    });
    expect(mock.summary).not.toHaveBeenCalled();
  });
  it("rejects unauthenticated and non-admin elevated reads before touching the database", async () => {
    expect((await request({ admin: "true" })).statusCode).toBe(403);
    mock.user = undefined;
    expect((await request()).statusCode).toBe(401);
    expect(mock.from).not.toHaveBeenCalled();
    expect(mock.summary).not.toHaveBeenCalled();
  });
});
