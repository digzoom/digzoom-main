import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router";
import { Store, Plus, Wallet, Copy, RefreshCw } from "lucide-react";
import PreviewFiles, {
  type PreviewAsset,
} from "@/components/partners/PreviewFiles";
import PartnerTerms from "@/components/partners/PartnerTerms";
import { PRODUCT_KINDS } from "@/data/partnerFiles";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  merchantApi,
  money,
  partnerStatusLabel,
  type MerchantAccountData,
  type MerchantDashboardData,
  type MerchantOffer,
} from "@/lib/merchant-api";

type Lang = "ar" | "en";
const box = "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7";
const button =
  "min-h-11 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-50";
const input =
  "mt-2 w-full min-w-0 rounded-lg border border-slate-300 bg-white p-3";
const errorText = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Unable to complete this request. Please retry.";
function localizedError(error: string, ar: boolean) {
  if (!ar && /[\u0600-\u06ff]/.test(error))
    return "Unable to complete this request. Check your details and sign-in, then retry or contact the team.";
  if (ar && !/[\u0600-\u06ff]/.test(error))
    return "تعذر إتمام الطلب. تحقق من اتصالك وتسجيل دخولك، ثم حاول مجددًا أو تواصل مع الإدارة.";
  return error;
}
function dateText(value: string | null | undefined, lang: Lang) {
  if (!value || !Number.isFinite(Date.parse(value))) return "—";
  return new Date(value).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US");
}

export default function PartnerDashboard() {
  const { user, loading } = useSupabaseAuth();
  const { lang } = useLanguage();
  const ar = lang === "ar";
  if (loading)
    return (
      <main
        dir={ar ? "rtl" : "ltr"}
        className="min-h-screen px-5 pt-36 text-center"
        role="status"
      >
        {ar ? "جارٍ التحميل…" : "Loading…"}
      </main>
    );
  if (!user)
    return (
      <main
        dir={ar ? "rtl" : "ltr"}
        className="min-h-screen bg-slate-50 px-5 pb-20 pt-36 text-center"
      >
        <h1 className="text-3xl font-black">
          {ar ? "لوحة التاجر" : "Seller dashboard"}
        </h1>
        <p className="my-6">
          {ar
            ? "سجّل الدخول بحسابك لتقديم طلب الشراكة ومتابعته."
            : "Sign in to apply for a partnership and track your application."}
        </p>
        <Link className={button} to="/login">
          {ar ? "تسجيل الدخول" : "Sign in"}
        </Link>
      </main>
    );
  // A new identity must never inherit the previous seller's data, drafts or pending responses.
  return <DashboardSession key={user.id} lang={lang} />;
}

function DashboardSession({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const t = (arabic: string, english: string) => (ar ? arabic : english);
  const [data, setData] = useState<MerchantDashboardData>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<"saved" | "">("");
  const [fetching, setFetching] = useState(true);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(false);
  const request = useRef<AbortController | null>(null);
  const actionPending = useRef(false);
  const load = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setFetching(true);
    setError("");
    try {
      const next = await merchantApi<MerchantDashboardData>(
        undefined,
        false,
        controller.signal
      );
      if (mounted.current && !controller.signal.aborted) setData(next);
    } catch (cause) {
      if (mounted.current && !controller.signal.aborted)
        setError(errorText(cause));
    } finally {
      if (mounted.current && !controller.signal.aborted) setFetching(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, [load]);

  async function act(body: unknown) {
    if (actionPending.current) return false;
    actionPending.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await merchantApi(body);
      if (!mounted.current) return false;
      setNotice("saved");
      await load();
      // A successful mutation stays successful even when its refresh fails. Do not invite duplicate submissions.
      return mounted.current;
    } catch (cause) {
      if (mounted.current) setError(errorText(cause));
      return false;
    } finally {
      actionPending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f7fb] px-4 pb-20 pt-28 text-slate-900 sm:pt-36"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-blue-600">
              {t("بع منتجاتك معنا", "Sell with us")}
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {t("لوحة التاجر", "Seller dashboard")}
            </h1>
            <p className="mt-3 text-slate-600">
              {t(
                "عروضك وطلباتك ومستحقاتك، في مكان واحد.",
                "Your products, orders and earnings in one place."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={busy || fetching}
            aria-label={t("تحديث", "Refresh")}
            className="min-h-11 min-w-11 rounded-xl border bg-white p-3 disabled:opacity-50"
          >
            <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
          </button>
        </header>
        {notice && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 p-4 text-emerald-800"
          >
            {t("تم الحفظ.", "Saved.")}
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
            {localizedError(error, ar)}{" "}
            {data &&
              t(
                "البيانات المعروضة من آخر تحديث ناجح.",
                "Displayed data is from the last successful refresh."
              )}
          </p>
        )}
        {!data && fetching && (
          <p role="status">
            {t("جارٍ تحميل البيانات…", "Loading your dashboard…")}
          </p>
        )}
        {data &&
          (data.merchant ? (
            <MerchantContent
              data={data as MerchantAccountData}
              lang={lang}
              busy={busy || fetching || Boolean(error)}
              act={act}
            />
          ) : (
            <section className={box}>
              <Store className="text-blue-600" />
              <h2 className="mt-4 text-xl font-black">
                {data.application
                  ? partnerStatusLabel(data.application.status, lang)
                  : t(
                      "ابدأ شراكتك مع DigZoom",
                      "Start your DigZoom partnership"
                    )}
              </h2>
              <p className="my-4 text-slate-600">
                {data.application
                  ? t(
                      "اعتماد الحساب بيد الإدارة بعد مراجعة الحقوق والشروط.",
                      "Our team approves your account after reviewing the selling rights and terms."
                    )
                  : t(
                      "قدّم طلبك؛ بعد الاعتماد تقدر ترفع عروضك وتتابع طلباتك.",
                      "Apply first. Once approved, you can submit products and track orders."
                    )}
              </p>
              <Link to="/partners#apply" className="font-bold text-blue-600">
                {t("صفحة الشراكة", "Partnership application")}
              </Link>
            </section>
          ))}
      </div>
    </main>
  );
}

function MerchantContent({
  data,
  lang,
  busy,
  act,
}: {
  data: MerchantAccountData;
  lang: Lang;
  busy: boolean;
  act: (body: unknown) => Promise<boolean>;
}) {
  const ar = lang === "ar";
  const t = (arabic: string, english: string) => (ar ? arabic : english);
  const cash = (value: number | null | undefined) => money(value, lang);
  const status = (value: string) => partnerStatusLabel(value, lang);
  const { merchant, offers, items, settlements, settings, summary } = data;
  const [edit, setEdit] = useState<MerchantOffer | null>(null);
  const [open, setOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<PreviewAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copyNotice, setCopyNotice] = useState<"copied" | "manual" | "">("");
  const inactive = merchant.status !== "active";
  const disabled = busy || uploading || inactive;
  const referral = `${window.location.origin}/api/merchant?ref=${merchant.referral_code}`;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const fields = Object.fromEntries(new FormData(form));
    const saved = await act({
      action: "save_offer",
      id: edit?.id,
      offer: {
        ...fields,
        status: submitter?.value === "draft" ? "draft" : "review",
        preview_asset_ids: previewFiles.map(file => file.id),
        rights_confirmed: true,
      },
    });
    if (saved) {
      setOpen(false);
      setEdit(null);
      setPreviewFiles([]);
    }
  }

  return (
    <>
      <section className={box}>
        <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
          {status(merchant.status)}
        </span>
        <p className="mt-4 text-slate-600">
          {t(
            "المنتجات تُعرض باسم DigZoom. بيانات هويتك خاصة بك وبالإدارة.",
            "Products are sold under DigZoom. Your identity is private to you and our team."
          )}
        </p>
        {inactive && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900"
          >
            {t(
              "حسابك موقوف. العروض والإحالة والتسوية متوقفة؛ راجع الإدارة.",
              "Your account is suspended. Listings, referrals and settlement are paused; contact the team."
            )}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code
            dir="ltr"
            className="min-w-0 max-w-full break-all rounded-lg bg-slate-50 p-3 text-sm"
          >
            {referral}
          </code>
          <button
            type="button"
            disabled={inactive}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(referral);
                setCopyNotice("copied");
              } catch {
                setCopyNotice("manual");
              }
            }}
            className="inline-flex min-h-11 items-center gap-2 font-bold text-blue-600 disabled:opacity-50"
          >
            <Copy size={17} />
            {t("نسخ رابط 15%", "Copy 15% referral link")}
          </button>
        </div>
        {copyNotice && (
          <p role="status" className="mt-3 text-sm text-blue-700">
            {copyNotice === "copied"
              ? t("تم نسخ رابطك.", "Your link was copied.")
              : t(
                  "تعذر النسخ التلقائي. انسخ الرابط الظاهر يدويًا.",
                  "Automatic copying failed. Copy the displayed link manually."
                )}
          </p>
        )}
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t(
            "نسبة رابطك 15% على منتجاتك خلال 7 أيام من زيارة العميل؛ طلبات DigZoom بنسبة 25% تشمل إدارة التسويق ضمن ميزانيتها، دون ضمان عدد مبيعات. الرابط يفتح متجر DigZoom.",
            "Your link applies a 15% commission to your products bought within 7 days of the visit. DigZoom sales have a 25% commission, including marketing management within its budget, without guaranteed sales. The link opens the DigZoom store."
          )}
        </p>
      </section>
      {summary ? (
        <section
          aria-label={t("ملخص المستحقات", "Earnings summary")}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                t("العروض", "Products submitted"),
                summary.offer_count.toLocaleString(ar ? "ar-SA" : "en-US"),
              ],
              [
                t("مستحقات مؤهلة", "Eligible earnings"),
                cash(summary.eligible_cents),
              ],
              [
                t(
                  "بانتظار التسليم أو المدة",
                  "Awaiting delivery or hold period"
                ),
                cash(summary.pending_cents),
              ],
              [
                t("مبالغ معلّقة للمراجعة", "Held for review"),
                cash(summary.held_cents),
              ],
              [
                t(
                  "جاهزة محاسبيًا قبل موانع الصرف",
                  "Ready before payout restrictions"
                ),
                cash(summary.ready_cents),
              ],
              [
                t(
                  "تحويلات مسجلة بعد رسوم التحويل",
                  "Recorded transfers after fees"
                ),
                cash(summary.settled_cents),
              ],
            ].map(([label, value]) => (
              <div key={label} className={box}>
                <Wallet className="text-blue-600" size={20} />
                <p className="mt-4 text-sm text-slate-600">{label}</p>
                <p className="mt-2 break-words text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className={`${box} text-sm leading-7`}>
            <p>
              {t(
                "الأرصدة تشمل السجل الكامل، وليست مجموع القائمة المختصرة أدناه.",
                "Balances cover the full history, not just the recent lists below."
              )}
            </p>
            {summary.fee_pending_count > 0 && (
              <p className="mt-2 text-amber-800">
                {t(
                  `${summary.fee_pending_count} طلبات مدفوعة تنتظر رسوم الدفع الفعلية؛ مستحقاتها غير مدرجة في الأرصدة المعروفة.`,
                  `${summary.fee_pending_count} paid product orders await actual payment fees; their unknown proceeds are not included in the known balances.`
                )}
              </p>
            )}
            {summary.unknown_held_count > 0 && (
              <p className="mt-2 text-amber-800">
                {t(
                  `${summary.unknown_held_count} طلبات معلّقة لم يُحدد صافيها بعد؛ المبلغ المعلّق المعروض غير مكتمل.`,
                  `${summary.unknown_held_count} held product orders have unknown proceeds; the displayed held amount is incomplete.`
                )}
              </p>
            )}
            {summary.payout_blocked ? (
              <p className="mt-2 font-bold text-amber-800">
                {summary.payout_block_reason === "suspended"
                  ? t(
                      "الصرف متوقف لأن حساب التاجر موقوف.",
                      "Settlement is blocked while your seller account is suspended."
                    )
                  : t(
                      "الصرف متوقف لجميع مستحقاتك بسبب استرجاع أو نزاع يحتاج مراجعة الإدارة، حتى لو اكتملت شروط طلبات أخرى.",
                      "All settlement is paused by a refund or dispute requiring review, even if other product orders are ready."
                    )}
              </p>
            ) : summary.eligible_cents < settings.minimum_payout_cents ? (
              <p className="mt-2 text-slate-600">
                {t("الحد الأدنى للتسوية", "Minimum settlement")}:{" "}
                {cash(settings.minimum_payout_cents)}.{" "}
                {t(
                  "الأهلية لا تعني تنفيذ التحويل.",
                  "Eligibility does not mean a transfer has been sent."
                )}
              </p>
            ) : (
              <p className="mt-2 text-slate-600">
                {t(
                  "المبلغ مؤهل للمراجعة ضمن التسوية الشهرية اليدوية، وتُخصم رسوم التحويل الفعلية عند الصرف.",
                  "This amount is eligible for review in the manual monthly settlement. Actual transfer fees are deducted when paid."
                )}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {t(
                "الملخص حسب آخر تحديث. حدّث اللوحة بعد اكتمال مدة الانتظار أو اعتماد التسليم.",
                "This is a snapshot from the last refresh. Refresh after the hold period ends or delivery is approved."
              )}
            </p>
          </div>
        </section>
      ) : (
        <p role="status" className="rounded-xl bg-amber-50 p-4 text-amber-900">
          {t(
            "ملخص الأرصدة غير متاح الآن. لا يمكن اعتبار مجموع القائمة المختصرة رصيدًا كاملًا؛ حدّث اللوحة أو راجع الإدارة.",
            "The full balance summary is unavailable. Recent lists cannot be treated as a complete balance; refresh or contact the team."
          )}
        </p>
      )}
      <PartnerTerms
        ar={ar}
        holdDays={settings.hold_days}
        minimumSar={settings.minimum_payout_cents / 100}
      />
      <section className={box}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black">{t("عروضك", "Your products")}</h2>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setEdit(null);
              setPreviewFiles([]);
              setOpen(!open);
            }}
            className={`inline-flex items-center gap-2 ${button}`}
          >
            <Plus size={18} />
            {t("عرض جديد", "New product")}
          </button>
        </div>
        {summary && summary.offer_count > offers.length && (
          <p className="mt-3 text-sm text-slate-600">
            {t(
              `تُعرض أحدث ${offers.length} من ${summary.offer_count} عروض.`,
              `Showing the latest ${offers.length} of ${summary.offer_count} products.`
            )}
          </p>
        )}
        {open && (
          <form
            onSubmit={save}
            key={edit?.id || "new"}
            className="mt-6 rounded-xl bg-slate-50 p-4"
          >
            <fieldset
              disabled={disabled}
              className="grid min-w-0 gap-4 sm:grid-cols-2"
            >
              <legend className="mb-4 font-black">
                {edit
                  ? t("تعديل العرض", "Edit product")
                  : t("إضافة عرض للمراجعة", "Submit a product for review")}
              </legend>
              <label className="min-w-0 font-bold">
                {t("اسم المنتج", "Product name")}
                <input
                  className={input}
                  name="title"
                  minLength={3}
                  maxLength={180}
                  required
                  defaultValue={edit?.title || ""}
                />
              </label>
              <label className="min-w-0 font-bold">
                {t("السعر بالريال (عدد صحيح)", "Price in SAR (whole number)")}
                <input
                  className={input}
                  name="price_sar"
                  type="number"
                  min={1}
                  max={100000}
                  step={1}
                  required
                  defaultValue={edit?.price_sar || ""}
                />
              </label>
              <label className="min-w-0 font-bold sm:col-span-2">
                {t("نوع المنتج", "Product type")}
                <select
                  name="product_kind"
                  required
                  defaultValue={edit?.product_kind || ""}
                  className={input}
                >
                  <option value="" disabled>
                    {t("اختر نوع المنتج", "Select a product type")}
                  </option>
                  {PRODUCT_KINDS.map(kind => (
                    <option key={kind.value} value={kind.value}>
                      {ar ? kind.ar : kind.en}
                    </option>
                  ))}
                </select>
              </label>
              <div className="min-w-0 sm:col-span-2">
                <PreviewFiles
                  value={previewFiles}
                  onChange={setPreviewFiles}
                  onBusy={setUploading}
                  disabled={busy || inactive}
                  ar={ar}
                />
                <p className="mt-3 text-xs leading-6 text-slate-600">
                  {t(
                    "أول صورة مرفوعة تُستخدم غلافًا للمنتج بعد اعتماد النشر. باقي الملفات تبقى للمعاينة فقط.",
                    "The first uploaded image becomes the product cover after approval. Other files remain private previews."
                  )}
                </p>
              </div>
              <label className="min-w-0 font-bold sm:col-span-2">
                {t("وصف المنتج", "Product description")}
                <textarea
                  className={input}
                  name="description"
                  minLength={30}
                  maxLength={4000}
                  required
                  rows={4}
                  defaultValue={edit?.description || ""}
                />
              </label>
              <label className="min-w-0 font-bold sm:col-span-2">
                {t("طريقة ومدة التسليم", "Delivery method and timeframe")}
                <textarea
                  className={input}
                  name="fulfillment_method"
                  minLength={10}
                  maxLength={1000}
                  required
                  defaultValue={edit?.fulfillment_method || ""}
                />
              </label>
              <label className="flex items-start gap-2 text-sm leading-6 sm:col-span-2">
                <input type="checkbox" required className="mt-1" />
                {t(
                  "أملك حقوق البيع والتسليم؛ المنتج لا يخالف شروط المنصة، وأوافق على شروط الشراكة.",
                  "I own the selling and delivery rights, the product follows platform rules, and I agree to the partnership terms."
                )}
              </label>
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button type="submit" value="review" className={button}>
                  {t("إرسال للمراجعة", "Submit for review")}
                </button>
                <button
                  type="submit"
                  value="draft"
                  className="min-h-11 rounded-lg border px-4 py-3"
                >
                  {t("حفظ مسودة", "Save draft")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEdit(null);
                    setPreviewFiles([]);
                  }}
                  className="min-h-11 px-3"
                >
                  {t("إلغاء", "Cancel")}
                </button>
              </div>
            </fieldset>
          </form>
        )}
        <div className="mt-5 space-y-3">
          {!offers.length && (
            <p className="text-slate-600">
              {t(
                "لا توجد عروض بعد. ارفع أول منتج للمراجعة.",
                "No products yet. Submit your first product for review."
              )}
            </p>
          )}
          {offers.map(offer => (
            <article
              key={offer.id}
              className="flex flex-wrap items-start gap-4 rounded-xl border p-4"
            >
              <img
                src={offer.image_url}
                alt=""
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-bold">{offer.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {cash(offer.price_sar * 100)} · {status(offer.status)}
                </p>
                {offer.review_note && (
                  <p className="mt-2 break-words text-sm text-amber-800">
                    {offer.review_note}
                  </p>
                )}
              </div>
              {["draft", "rejected"].includes(offer.status) && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setEdit(offer);
                    setPreviewFiles(
                      (offer.preview_asset_ids || []).map(id => ({
                        id,
                        name: t("ملف معاينة", "Preview file"),
                        mime_type: "",
                        size_bytes: 0,
                      }))
                    );
                    setOpen(true);
                  }}
                  className="min-h-11 font-bold text-blue-600 disabled:opacity-50"
                >
                  {t("تعديل", "Edit")}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className={box}>
        <h2 className="text-xl font-black">
          {t("طلبات المنتجات", "Product orders")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {t(
            "ارفع إثبات التسليم؛ الإدارة تراجعه وتعتمده. بيانات العميل لا تظهر في اللوحة.",
            "Submit delivery evidence for the team to approve. Customer details are not shown in this dashboard."
          )}
        </p>
        {summary && summary.order_count > items.length && (
          <p className="mt-3 text-sm text-slate-600">
            {t(
              `تُعرض أحدث ${items.length} من ${summary.order_count} طلبات منتجات.`,
              `Showing the latest ${items.length} of ${summary.order_count} product-order entries.`
            )}
          </p>
        )}
        <div className="mt-5 space-y-4">
          {!items.length && (
            <p className="text-slate-600">
              {t("لا توجد طلبات بعد.", "No orders yet.")}
            </p>
          )}
          {items.map(item => (
            <article key={item.id} className="min-w-0 rounded-xl border p-4">
              <h3 className="break-words font-bold">
                {item.product_title} × {item.quantity}
              </h3>
              <p dir="ltr" className="mt-2 break-all text-xs text-slate-500">
                {item.order_id}
              </p>
              <p className="mt-3 text-sm">
                {item.order_status === "cancelled"
                  ? t("طلب ملغي", "Order cancelled")
                  : item.order_status === "refunded"
                    ? t("طلب مسترجع", "Order refunded")
                    : status(item.status)}{" "}
                · {item.commission_percent}% ·{" "}
                {item.source === "merchant"
                  ? t("من رابطك", "Your referral")
                  : t("من DigZoom", "DigZoom sale")}
              </p>
              <div className="mt-3 grid gap-2 break-words text-sm sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  {t("البيع", "Sale")}: {cash(item.gross_cents)}
                </p>
                <p>
                  {t("رسوم الدفع", "Payment fees")}:{" "}
                  {cash(item.stripe_fee_cents)}
                </p>
                <p>
                  {t("العمولة", "Commission")}: {cash(item.commission_cents)}
                </p>
                <p className="font-bold">
                  {t("مستحقك", "Your proceeds")}: {cash(item.merchant_cents)}
                </p>
              </div>
              {item.status === "ready" && (
                <p className="mt-3 text-sm text-slate-600">
                  {item.delivered_at
                    ? t("التسليم معتمد.", "Delivery approved.")
                    : t(
                        "بانتظار اعتماد التسليم.",
                        "Delivery approval pending."
                      )}{" "}
                  {t("نهاية مدة الانتظار", "Payment hold ends")}:{" "}
                  {dateText(item.ready_at, lang)}.{" "}
                  {t(
                    "اكتمال الاحتساب لا يعني أن التحويل قد نُفّذ.",
                    "Calculation complete does not mean a transfer has been sent."
                  )}
                </p>
              )}
              {(item.status === "held" || item.hold_reason) && (
                <p className="mt-3 text-sm text-amber-800">
                  {t(
                    "معلّق: راجع الإدارة لتسوية الاسترجاع أو النزاع. المستحق المعروض قبل أي تعديل ناتج عن المراجعة.",
                    "Held: contact the team for refund or dispute reconciliation. Displayed proceeds are before any adjustment from that review."
                  )}
                </p>
              )}
              {item.fulfillment_submitted_at && (
                <p className="mt-3 text-sm text-emerald-800">
                  {item.delivered_at
                    ? t("التسليم معتمد", "Delivery approved")
                    : t(
                        "إثبات التسليم بانتظار اعتماد الإدارة",
                        "Delivery evidence awaits approval"
                      )}
                </p>
              )}
              {item.paid_at &&
                !item.delivered_at &&
                !item.settlement_id &&
                ["paid", "processing", "completed"].includes(
                  item.order_status || ""
                ) &&
                ["ready", "fee_pending"].includes(item.status) &&
                !inactive && (
                  <form
                    className="mt-4 space-y-3"
                    onSubmit={async event => {
                      event.preventDefault();
                      if (disabled) return;
                      const form = event.currentTarget;
                      const note = String(new FormData(form).get("note") || "");
                      if (await act({ action: "fulfill", id: item.id, note }))
                        form.reset();
                    }}
                  >
                    <label className="block text-sm font-bold">
                      {t(
                        "تفاصيل أو رابط إثبات التسليم",
                        "Delivery evidence details or link"
                      )}
                      <textarea
                        name="note"
                        required
                        minLength={10}
                        maxLength={3000}
                        defaultValue={item.fulfillment_note || ""}
                        disabled={disabled}
                        className={input}
                        rows={2}
                      />
                    </label>
                    <button disabled={disabled} className={button}>
                      {t("إرسال إثبات التسليم", "Submit delivery evidence")}
                    </button>
                  </form>
                )}
            </article>
          ))}
        </div>
      </section>
      <section className={box}>
        <h2 className="text-xl font-black">
          {t("سجل التسويات", "Settlement history")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {t(
            "التحويل يتم يدويًا خارج الموقع، ثم تسجّله الإدارة هنا بالمرجع والرسوم الفعلية.",
            "Transfers are made manually outside the site, then recorded here by the team with the reference and actual fees."
          )}
        </p>
        {summary && summary.settlement_count > settlements.length && (
          <p className="mt-3 text-sm text-slate-600">
            {t(
              `تُعرض أحدث ${settlements.length} من ${summary.settlement_count} تسويات.`,
              `Showing the latest ${settlements.length} of ${summary.settlement_count} settlements.`
            )}
          </p>
        )}
        {!settlements.length && (
          <p className="mt-4 text-slate-600">
            {t(
              "لم تُسجّل تحويلات بعد.",
              "No transfers have been recorded yet."
            )}
          </p>
        )}
        {settlements.map(settlement => (
          <div key={settlement.id} className="mt-4 rounded-xl border p-4">
            <p className="break-words">
              {t("المستحق", "Proceeds")}: {cash(settlement.gross_cents)} ·{" "}
              {t("رسوم التحويل", "Transfer fees")}:{" "}
              {cash(settlement.transfer_fee_cents)}
            </p>
            <p className="mt-2 break-words font-bold">
              {t("المحوّل", "Transferred")}: {cash(settlement.paid_cents)}
            </p>
            <p className="mt-2 break-all text-sm text-slate-600">
              {settlement.reference} · {dateText(settlement.created_at, lang)}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
