import { createHmac, timingSafeEqual } from "node:crypto";

function accessSecret() {
  const secret = process.env.ORDER_ACCESS_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Order access is not configured");
  return secret;
}

// Domain-separated bearer token: the payment URL has no recipient access,
// and a paid order can only be delivered to its owner or this private token.
export function orderAccessToken(orderId: string) {
  return createHmac("sha256", accessSecret())
    .update(`digzoom-shared-delivery:v1:${orderId}`)
    .digest("hex");
}

export function validOrderAccessToken(orderId: string, candidate: string) {
  if (!/^[0-9a-f]{64}$/i.test(candidate)) return false;
  const expected = Buffer.from(orderAccessToken(orderId), "hex");
  return timingSafeEqual(expected, Buffer.from(candidate, "hex"));
}
