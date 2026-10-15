// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PartnerDashboard from "@/pages/PartnerDashboard";
import type {
  MerchantAccountData,
  MerchantDashboardData,
} from "@/lib/merchant-api";

const state = vi.hoisted(() => ({
  user: { id: "seller-one" } as { id: string } | null,
  loading: false,
  lang: "en" as "en" | "ar",
  api: vi.fn(),
}));
vi.mock("@/hooks/useSupabaseAuth", () => ({
  useSupabaseAuth: () => ({ user: state.user, loading: state.loading }),
}));
vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({ lang: state.lang }),
}));
vi.mock("@/lib/merchant-api", async importOriginal => ({
  ...(await importOriginal<typeof import("@/lib/merchant-api")>()),
  merchantApi: state.api,
}));
vi.mock("@/components/partners/PreviewFiles", () => ({
  default: ({ ar }: { ar: boolean }) => (
    <div>{ar ? "ملفات المعاينة" : "Preview files"}</div>
  ),
}));

let root: Root;
let container: HTMLDivElement;
const fixture = (): MerchantAccountData => ({
  merchant: { id: "m-one", status: "active", referral_code: "a".repeat(36) },
  application: null,
  offers: [
    {
      id: "offer",
      title: "Example product",
      description: "A detailed description for this digital product.",
      price_sar: 100,
      image_url: "/logo.png",
      product_kind: "book",
      fulfillment_method: "Delivered after payment within one day",
      status: "draft",
      preview_asset_ids: ["preview"],
    },
  ],
  items: [
    {
      id: "item",
      order_id: "DZ-verified-order",
      order_status: "paid",
      product_title: "Example product",
      quantity: 1,
      source: "merchant",
      commission_percent: 15,
      gross_cents: 10000,
      stripe_fee_cents: null,
      commission_cents: null,
      merchant_cents: null,
      status: "fee_pending",
      paid_at: "2026-10-01T00:00:00Z",
      ready_at: null,
      fulfillment_submitted_at: null,
      delivered_at: null,
      hold_reason: null,
      settlement_id: null,
    },
  ],
  settlements: [],
  settings: { hold_days: 14, minimum_payout_cents: 100000 },
  summary: {
    offer_count: 251,
    order_count: 501,
    settlement_count: 101,
    ready_cents: 125000,
    eligible_cents: 0,
    pending_cents: 20000,
    held_cents: 10000,
    settled_cents: 230000,
    fee_pending_count: 1,
    unknown_held_count: 1,
    pending_delivery_count: 1,
    pending_hold_count: 1,
    payout_blocked: true,
    payout_block_reason: "held",
    evaluated_at: "2026-10-15T00:00:00Z",
  },
});
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}
async function render() {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <PartnerDashboard />
      </MemoryRouter>
    );
  });
}
function button(text: string) {
  const result = [...container.querySelectorAll("button")].find(
    node =>
      node.textContent === text || node.getAttribute("aria-label") === text
  );
  expect(result, text).toBeDefined();
  return result!;
}
async function click(text: string) {
  await act(async () => button(text).click());
}
function text() {
  return container.textContent || "";
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  state.user = { id: "seller-one" };
  state.lang = "en";
  state.loading = false;
  state.api.mockReset().mockResolvedValue(fixture());
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("seller dashboard", () => {
  it.each(["en", "ar"] as const)(
    "localizes the logged-out route and direction in %s",
    async lang => {
      state.lang = lang;
      state.user = null;
      await render();
      expect(container.querySelector("main")?.dir).toBe(
        lang === "ar" ? "rtl" : "ltr"
      );
      expect(text()).toContain(lang === "ar" ? "تسجيل الدخول" : "Sign in");
      expect(container.querySelector("a")?.getAttribute("href")).toBe("/login");
      expect(state.api).not.toHaveBeenCalled();
    }
  );
  it("uses complete server totals, exposes truncation and explains held and unknown amounts", async () => {
    await render();
    expect(text()).toContain("SAR");
    expect(text()).toContain("2,300.00");
    expect(text()).toContain("Showing the latest 1 of 251 products.");
    expect(text()).toContain(
      "Showing the latest 1 of 501 product-order entries."
    );
    expect(text()).toContain("Showing the latest 0 of 101 settlements.");
    expect(text()).toContain("All settlement is paused");
    expect(text()).toContain("1 held product orders have unknown proceeds");
    expect(text()).toContain("Fees pending");
    expect(text()).toContain("15%");
    expect(text()).toContain("25%");
    expect(text()).toContain("7 days");
    expect(text()).toContain("14-day");
    expect(text()).toContain("SAR 1000");
    expect(text()).toContain("Transfers are made manually outside the site");
  });
  it("switches the entire dashboard, form and terms to Arabic without another data fetch", async () => {
    await render();
    await click("New product");
    expect(text()).toContain("Product type");
    expect(text()).toContain("Book or guide");
    state.lang = "ar";
    await render();
    expect(container.querySelector("main")?.dir).toBe("rtl");
    expect(text()).toContain("نوع المنتج");
    expect(text()).toContain("ملفات المعاينة");
    expect(text()).toContain("شروط الشراكة والبيع");
    expect(text()).not.toContain("Seller dashboard");
    expect(state.api).toHaveBeenCalledTimes(1);
  });
  it("never substitutes a capped-list sum when the complete summary is missing", async () => {
    const data = fixture();
    delete data.summary;
    state.api.mockResolvedValue(data);
    await render();
    expect(text()).toContain("The full balance summary is unavailable");
    expect(
      container.querySelector('[aria-label="Earnings summary"]')
    ).toBeNull();
  });
  it("clears old data immediately on account switches and ignores an old pending response", async () => {
    const old = deferred<MerchantDashboardData>();
    state.api.mockReturnValueOnce(old.promise);
    await render();
    state.user = { id: "seller-two" };
    state.api.mockResolvedValue({ merchant: null, application: null });
    await render();
    await act(async () => old.resolve(fixture()));
    expect(text()).toContain("Start your DigZoom partnership");
    expect(text()).not.toContain("Example product");
    state.user = null;
    await render();
    expect(text()).toContain("Sign in");
    expect(text()).not.toContain("15%");
  });
  it("aborts a pending read on sign-out and does not resurrect seller content", async () => {
    const old = deferred<MerchantDashboardData>();
    state.api.mockReturnValueOnce(old.promise);
    await render();
    const signal = state.api.mock.calls[0][2] as AbortSignal;
    state.user = null;
    await render();
    expect(signal.aborted).toBe(true);
    await act(async () => old.resolve(fixture()));
    expect(text()).not.toContain("Example product");
  });
  it("separates copied-link success from errors and blocks copying for suspended accounts", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    await render();
    await click("Copy 15% referral link");
    expect(text()).toContain("Your link was copied.");
    expect(container.querySelector('[role="alert"]')).toBeNull();
    const data = fixture();
    data.merchant.status = "suspended";
    state.api.mockResolvedValue(data);
    await click("Refresh");
    expect(button("Copy 15% referral link").disabled).toBe(true);
    expect(button("New product").disabled).toBe(true);
  });
  it("shows a refresh error with stale-data warning and disables mutations until fresh data arrives", async () => {
    await render();
    state.api.mockRejectedValueOnce(new Error("Network failed"));
    await click("Refresh");
    expect(text()).toContain(
      "Displayed data is from the last successful refresh"
    );
    expect(text()).toContain("Example product");
    expect(button("New product").disabled).toBe(true);
    expect(button("Refresh").disabled).toBe(false);
    await click("Refresh");
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(button("New product").disabled).toBe(false);
  });
  it.each(["cancelled", "refunded"])(
    "hides delivery writes and labels a %s parent order",
    async orderStatus => {
      const data = fixture();
      data.items[0].order_status = orderStatus;
      data.items[0].status = "ready";
      state.api.mockResolvedValue(data);
      await render();
      expect(text()).toContain(
        orderStatus === "cancelled" ? "Order cancelled" : "Order refunded"
      );
      expect(
        [...container.querySelectorAll("button")].some(
          node => node.textContent === "Submit delivery evidence"
        )
      ).toBe(false);
    }
  );

  it("cancels an edit cleanly, and a new form does not retain that product", async () => {
    await render();
    await click("Edit");
    expect(
      (container.querySelector('[name="title"]') as HTMLInputElement).value
    ).toBe("Example product");
    await click("Cancel");
    expect(container.querySelector('[name="title"]')).toBeNull();
    await click("New product");
    expect(
      (container.querySelector('[name="title"]') as HTMLInputElement).value
    ).toBe("");
  });
  it("sends draft/review choice explicitly, blocks repeated submit, and does not retry a saved write after refresh failure", async () => {
    await render();
    await click("Edit");
    const pending = deferred<unknown>();
    state.api
      .mockReturnValueOnce(pending.promise)
      .mockRejectedValueOnce(new Error("Refresh failed"));
    const form = container.querySelector('[name="title"]')!.closest("form")!;
    const submitter = button("Save draft");
    await act(async () => {
      form.dispatchEvent(
        new SubmitEvent("submit", {
          bubbles: true,
          cancelable: true,
          submitter,
        })
      );
      form.dispatchEvent(
        new SubmitEvent("submit", {
          bubbles: true,
          cancelable: true,
          submitter,
        })
      );
    });
    const writes = state.api.mock.calls.filter(call => call[0]);
    expect(writes).toHaveLength(1);
    expect(writes[0][0]).toMatchObject({
      action: "save_offer",
      id: "offer",
      offer: { status: "draft", preview_asset_ids: ["preview"] },
    });
    await act(async () => pending.resolve({ ok: true }));
    expect(text()).toContain("Saved.");
    expect(text()).toContain(
      "Displayed data is from the last successful refresh"
    );
    expect(container.querySelector('[name="title"]')).toBeNull();
    expect(state.api.mock.calls.filter(call => call[0])).toHaveLength(1);
  });
});
