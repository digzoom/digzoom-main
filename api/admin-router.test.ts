import { describe, expect, it } from "vitest";
import { adminRouter } from "../netlify/lib/admin-router";

describe("Netlify admin router contract", () => {
  it("exposes every procedure used by the storefront and admin dashboard", () => {
    const procedures = Object.keys(adminRouter._def.procedures);

    expect(procedures).toEqual(
      expect.arrayContaining([
        "ping",
        "listSettings",
        "updateSetting",
        "createOrder",
        "listOrderDownloads",
        "createDownloadLink",
        "listProducts",
        "createProduct",
        "updateProduct",
        "toggleProduct",
        "deleteProduct",
        "listOrders",
        "updateOrderStatus",
        "getStats",
        "listCustomers",
        "listCoupons",
        "listReviews",
        "listProductImages",
        "getAnalytics",
      ])
    );
  });
});
