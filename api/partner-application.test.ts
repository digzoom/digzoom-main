import type { HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  from: vi.fn(),
  verifyToken: vi.fn(),
  ownedPreviewAssets: vi.fn(),
}));

vi.mock("../netlify/lib/trpc", () => ({ verifySupabaseToken: mock.verifyToken }));
vi.mock("../netlify/lib/supabase-admin", () => ({ getSupabaseAdmin: () => ({ from: mock.from }) }));
vi.mock("../netlify/lib/partner-assets", () => ({ ownedPreviewAssets: mock.ownedPreviewAssets }));

const applicationId = "saved-application-id";
const application = {
  terms_version: "2026-10-v1",
  name: "Test Partner",
  email: "partner@example.test",
  phone: "123456789",
  brand: "Test Brand",
  product_type: "template",
  preview_url: "https://example.test/preview",
  description: "A test application",
  rights_confirmed: true,
};
const insert = {
  insert: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

async function call() {
  const { handler } = await import("../netlify/functions/partner-application");
  const event: HandlerEvent = {
    rawUrl: "https://example.test/.netlify/functions/partner-application",
    rawQuery: "",
    path: "/.netlify/functions/partner-application",
    httpMethod: "POST",
    headers: { authorization: "Bearer test-token", "x-nf-client-connection-ip": "192.0.2.1" },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: JSON.stringify(application),
    isBase64Encoded: false,
  };
  return await handler(event, {} as HandlerContext, () => {}) as HandlerResponse;
}

function expectSaved(response: HandlerResponse) {
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body as string)).toEqual({ success: true, application_id: applicationId });
  expect(insert.insert).toHaveBeenCalledTimes(1);
  expect(insert.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "verified-user", email: application.email }));
  expect(insert.single).toHaveBeenCalledTimes(1);
}

describe("partner application submission receipts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "test-sender@example.test");
    vi.stubEnv("CONTACT_TO_EMAIL", "test-recipient@example.test");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Unexpected network request")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    mock.verifyToken.mockResolvedValue({ id: "verified-user", email: application.email });
    mock.ownedPreviewAssets.mockResolvedValue([]);
    insert.single.mockResolvedValue({ data: { id: applicationId }, error: null });
    const recent = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockResolvedValue({ count: 0, error: null }),
    };
    mock.from.mockReset().mockReturnValueOnce(recent).mockReturnValueOnce(insert);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns the saved application ID when the notification succeeds", async () => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 200 }));

    expectSaved(await call());

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({
      method: "POST",
      signal: expect.any(AbortSignal),
      headers: expect.objectContaining({ Authorization: "Bearer test-resend-key" }),
    }));
    expect(console.error).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("returns the saved application ID when the mail request rejects", async () => {
    vi.useFakeTimers();
    const error = new Error("Mail service unavailable");
    vi.mocked(fetch).mockRejectedValue(error);

    expectSaved(await call());

    expect(console.error).toHaveBeenCalledWith("[partner-application] Notification failed", { application_id: applicationId, error });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("logs a non-2xx mail response without rejecting the saved application", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("Service unavailable", { status: 503 }));

    expectSaved(await call());

    expect(console.error).toHaveBeenCalledWith("[partner-application] Notification failed", { application_id: applicationId, status: 503 });
  });

  it("aborts a slow notification after five seconds and returns the saved application ID", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    let notifyStarted: () => void = () => {};
    const started = new Promise<void>(resolve => { notifyStarted = resolve; });
    vi.mocked(fetch).mockImplementation((_url, init) => new Promise<Response>((_resolve, reject) => {
      signal = init?.signal as AbortSignal;
      signal.addEventListener("abort", () => reject(new DOMException("Request aborted", "AbortError")), { once: true });
      notifyStarted();
    }));

    const result = call();
    await started;
    await vi.advanceTimersByTimeAsync(4999);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    expectSaved(await result);
    expect(signal?.aborted).toBe(true);
    expect(console.error).toHaveBeenCalledWith("[partner-application] Notification failed", expect.objectContaining({ application_id: applicationId }));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("succeeds without a notification when no mail key is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    expectSaved(await call());

    expect(fetch).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("returns a failure and sends no notification when the database insert fails", async () => {
    const error = new Error("Database insert failed");
    insert.single.mockResolvedValue({ data: null, error });

    const response = await call();

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body as string)).toEqual({ error: "Unable to submit" });
    expect(insert.insert).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("[partner-application]", error);
  });
});
