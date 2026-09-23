import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./trpc";
import { getSupabaseAdmin } from "./supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any { return getSupabaseAdmin(); }

async function createStripeCheckout(params: URLSearchParams) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured");
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const body = await response.json() as { id?: string; url?: string; error?: { message?: string } };
  if (!response.ok || !body.id || !body.url) {
    throw new Error(body.error?.message || "Stripe checkout request failed");
  }
  return { id: body.id, url: body.url };
}

async function retrieveStripeCheckout(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured");
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const body = await response.json() as {
    id?: string;
    payment_status?: string;
    metadata?: { order_id?: string };
    error?: { message?: string };
  };
  if (!response.ok || !body.id) {
    throw new Error(body.error?.message || "Unable to verify payment");
  }
  return body;
}

async function authorizeOrderAccess(orderId: string, userId?: string, sessionId?: string) {
  const { data: order, error } = await admin()
    .from("orders")
    .select("id,user_id,status,paid_at,payment_payload")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) throw new Error("Order not found");
  const paid = order.status === "paid" || order.status === "completed" || !!order.paid_at;
  if (userId && order.user_id === userId && paid) return order;

  if (sessionId) {
    const storedSessionId = order.payment_payload?.checkout_session_id;
    if (storedSessionId !== sessionId) throw new Error("Download authorization failed");
    const session = await retrieveStripeCheckout(sessionId);
    if (session.payment_status === "paid" && session.metadata?.order_id === orderId) return order;
  }

  throw new Error("Downloads are not available for this order");
}

const couponCartItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().int().min(1).max(100),
});

async function loadValidatedCart(items: Array<{ product_id: number; quantity: number }>) {
  const productIds = [...new Set(items.map((item) => item.product_id))];
  const { data: products, error } = await admin()
    .from("products")
    .select("id,title,title_ar,title_en,price,product_type,is_active,in_stock")
    .in("id", productIds);

  if (error) throw new Error("Unable to validate cart");
  if (!products || products.length !== productIds.length) {
    throw new Error("One or more products are unavailable");
  }

  const productsById = new Map(products.map((product: any) => [product.id, product]));
  const validatedItems = items.map((item) => {
    const product: any = productsById.get(item.product_id);
    if (!product?.is_active || !product?.in_stock) {
      throw new Error("One or more products are unavailable");
    }
    return {
      product_id: product.id,
      quantity: item.quantity,
      price: Number(product.price),
      title: product.title_ar || product.title || product.title_en,
      product_type: product.product_type || "digital_download",
    };
  });

  const subtotal = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { validatedItems, subtotal };
}

async function getCouponDiscount(code: string | undefined, subtotal: number) {
  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) {
    return { couponId: null, code: null, discountPercent: 0, discountAmount: 0, totalAmount: subtotal };
  }

  const { data, error } = await admin().rpc("validate_coupon", {
    p_code: normalizedCode,
    p_order_amount: Math.round(subtotal),
  });
  if (error) throw new Error("Unable to validate coupon");

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.valid) {
    throw new Error(result?.message || "Coupon is invalid or expired");
  }

  const discountPercent = Number(result.discount_percent || 0);
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  return {
    couponId: Number(result.coupon_id),
    code: normalizedCode,
    discountPercent,
    discountAmount,
    totalAmount: Math.max(0, subtotal - discountAmount),
  };
}

// Helper: log admin activity (non-blocking, swallows errors)
async function logActivity(data: {
  adminEmail: string;
  adminId?: string;
  action: string;
  productId?: number;
  productTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldValue?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue?: any;
}) {
  try {
    await admin().from("admin_audit_logs").insert({
      admin_email: data.adminEmail,
      admin_id: data.adminId,
      action: data.action,
      entity_id: data.productId,
      entity_type: data.productTitle,
      old_value: data.oldValue,
      new_value: data.newValue,
    });
  } catch (e: any) {
    console.error("[logActivity] failed:", e.message);
  }
}

export const adminRouter = createRouter({
  // Health check — no auth
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  // Debug: return current user context (any logged-in user)
  me: publicQuery.query(({ ctx }) => {
    const user = (ctx as any)?.user;
    return {
      hasUser: !!user,
      userId: user?.id || null,
      email: user?.email || null,
      role: user?.role || null,
      isAdmin: user?.role === 'admin',
    };
  }),

  /* ─── Store Settings ─── */
  listSettings: publicQuery.query(async () => {
    const { data, error } = await admin()
      .from('store_settings')
      .select('*')
      .eq('is_active', true)
      .order('group_name', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }),

  updateSetting: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = (ctx as any)?.user;
      const { error } = await admin()
        .from('store_settings')
        .update({ value: input.value, updated_at: new Date().toISOString(), updated_by: user?.id })
        .eq('key', input.key);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /* Validate a private coupon without exposing the coupons table. Product
     prices and the subtotal are always rebuilt on the server. */
  validateCoupon: publicQuery
    .input(z.object({
      code: z.string().trim().min(1).max(64),
      items: z.array(couponCartItemSchema).min(1).max(100),
    }))
    .mutation(async ({ input }) => {
      const { subtotal } = await loadValidatedCart(input.items);
      const coupon = await getCouponDiscount(input.code, subtotal);
      return {
        valid: true,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        subtotal,
        totalAmount: coupon.totalAmount,
      };
    }),

  /* ─── Create Order (public — guest checkout, no auth required) ─── */
  createOrder: publicQuery
    .input(
      z.object({
        customer_name: z.string().min(1),
        customer_email: z.string().email(),
        customer_phone: z.string().optional(),
        items: z.array(
          z.object({
            product_id: z.number(),
            quantity: z.number().min(1),
            price: z.number().min(0),
            title: z.string(),
            product_type: z.string().default("digital_download"),
          })
        ),
        subtotal: z.number().min(0),
        tax_amount: z.number().min(0).default(0),
        total_amount: z.number().min(0),
        discount_amount: z.number().min(0).default(0),
        coupon_code: z.string().optional(),
        coupon_discount: z.number().min(0).default(0),
        customer_notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Fail closed until a verified payment flow is connected. This must be
      // enabled explicitly on the server; hiding the checkout button alone is
      // not sufficient because this public mutation can be called directly.
      if (process.env.CHECKOUT_ENABLED !== "true") {
        throw new Error("Checkout is temporarily unavailable");
      }

      // Never trust prices, titles, product state, or totals supplied by the
      // browser. Rebuild the order from active database products.
      const { validatedItems, subtotal } = await loadValidatedCart(input.items);
      const coupon = await getCouponDiscount(input.coupon_code, subtotal);
      // Keep checkout totals consistent with the storefront. VAT must not be
      // collected until the business is registered and the tax flow is
      // explicitly enabled and tested.
      const taxAmount = 0;
      const totalAmount = coupon.totalAmount + taxAmount;

      const orderId = `DZ-${Date.now().toString(36).toUpperCase()}`;

      // 1. Insert order
      const { error: orderError } = await admin()
        .from("orders")
        .insert({
          id: orderId,
          status: "pending",
          user_id: ctx.user?.id || null,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          discount_amount: coupon.discountAmount,
          payment_method: "pending",
          customer_name: input.customer_name,
          customer_email: input.customer_email,
          customer_phone: input.customer_phone || null,
          coupon_id: coupon.couponId,
          coupon_code: coupon.code,
          coupon_discount: coupon.discountPercent,
          customer_notes: input.customer_notes || null,
          customer_input: {},
          payment_payload: {},
        });

      if (orderError) {
        console.error("[createOrder] order insert error:", orderError.message);
        throw new Error("Failed to create order: " + orderError.message);
      }

      // 2. Insert order items
      const orderItems = validatedItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.price,
        product_title: item.title,
        product_type: item.product_type,
        delivery_status: "pending",
        max_downloads: 5,
        download_count: 0,
      }));

      const { error: itemsError } = await admin()
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("[createOrder] items insert error:", itemsError.message);
        // Attempt cleanup — best effort
        await admin().from("orders").delete().eq("id", orderId);
        throw new Error("Failed to create order items: " + itemsError.message);
      }

      try {
        const siteUrl = (process.env.SITE_URL || process.env.URL || "https://digzoom.com").replace(/\/$/, "");
        const stripeParams = new URLSearchParams({
          mode: "payment",
          customer_email: input.customer_email.trim().toLowerCase(),
          "metadata[order_id]": orderId,
          "payment_intent_data[metadata][order_id]": orderId,
          success_url: `${siteUrl}/thank-you?order_id=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/checkout?payment=cancelled`,
        });
        if (coupon.code) {
          stripeParams.set("line_items[0][quantity]", "1");
          stripeParams.set("line_items[0][price_data][currency]", "sar");
          stripeParams.set("line_items[0][price_data][unit_amount]", String(Math.round(totalAmount * 100)));
          stripeParams.set("line_items[0][price_data][product_data][name]", `DigZoom order ${orderId}`);
          stripeParams.set("line_items[0][price_data][product_data][description]", `${coupon.code} · ${coupon.discountPercent}% discount`);
        } else {
          validatedItems.forEach((item, index) => {
            stripeParams.set(`line_items[${index}][quantity]`, String(item.quantity));
            stripeParams.set(`line_items[${index}][price_data][currency]`, "sar");
            stripeParams.set(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
            stripeParams.set(`line_items[${index}][price_data][product_data][name]`, item.title.slice(0, 120));
          });
        }
        const session = await createStripeCheckout(stripeParams);

        await admin().from("orders").update({
          payment_method: "stripe",
          payment_payload: { checkout_session_id: session.id },
        }).eq("id", orderId);

        return { orderId, status: "pending", checkoutUrl: session.url };
      } catch (error: any) {
        console.error("[createOrder] Stripe session error:", error?.message || error);
        await admin().from("orders").update({ status: "payment_failed" }).eq("id", orderId);
        throw new Error("Unable to start secure payment");
      }
    }),

  /* Secure digital delivery. Metadata is separate from signed-link creation
     so refreshing the confirmation page does not consume a download. */
  listOrderDownloads: publicQuery
    .input(z.object({
      order_id: z.string().min(6),
      session_id: z.string().min(10).max(255).optional(),
    }))
    .query(async ({ input, ctx }) => {
      await authorizeOrderAccess(input.order_id, ctx.user?.id, input.session_id);

      const { data: items, error: itemsError } = await admin()
        .from("order_items")
        .select("id,product_id,product_title,download_count,max_downloads,delivery_status")
        .eq("order_id", input.order_id);
      if (itemsError) throw new Error("Unable to load order downloads");

      const productIds = (items ?? []).map((item: any) => item.product_id).filter(Boolean);
      const { data: products, error: productsError } = await admin()
        .from("products")
        .select("id,title_ar,title_en,file_type,file_size,image_url,storage_path")
        .in("id", productIds);
      if (productsError) throw new Error("Unable to load product files");
      const productsById = new Map((products ?? []).map((product: any) => [product.id, product]));

      return (items ?? []).map((item: any) => {
        const product: any = productsById.get(item.product_id);
        return {
          order_item_id: item.id,
          title_ar: product?.title_ar || item.product_title,
          title_en: product?.title_en || item.product_title,
          file_type: product?.file_type || "XLSX",
          file_size: product?.file_size || "",
          image_url: product?.image_url || "",
          download_count: item.download_count || 0,
          max_downloads: item.max_downloads || 5,
          available: Boolean(product?.storage_path) && (item.download_count || 0) < (item.max_downloads || 5),
        };
      });
    }),

  createDownloadLink: publicQuery
    .input(z.object({
      order_id: z.string().min(6),
      order_item_id: z.number().int().positive(),
      session_id: z.string().min(10).max(255).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await authorizeOrderAccess(input.order_id, ctx.user?.id, input.session_id);

      const { data: item } = await admin()
        .from("order_items")
        .select("id,product_id,download_count,max_downloads")
        .eq("id", input.order_item_id)
        .eq("order_id", input.order_id)
        .maybeSingle();
      if (!item || item.download_count >= item.max_downloads) {
        throw new Error("Download limit reached");
      }

      const { data: product } = await admin()
        .from("products")
        .select("storage_path,title_en")
        .eq("id", item.product_id)
        .maybeSingle();
      if (!product?.storage_path) throw new Error("Product file is not ready");

      // Compare-and-swap prevents concurrent requests from exceeding the limit.
      const { data: updated, error: updateError } = await admin()
        .from("order_items")
        .update({
          download_count: item.download_count + 1,
          delivery_status: "delivered",
          delivered_at: new Date().toISOString(),
        })
        .eq("id", item.id)
        .eq("download_count", item.download_count)
        .lt("download_count", item.max_downloads)
        .select("id")
        .maybeSingle();
      if (updateError || !updated) throw new Error("Please retry the download");

      const filename = `${product.title_en || "digzoom-product"}.xlsx`.replace(/[^a-zA-Z0-9._ -]/g, "");
      const { data: signed, error: signedError } = await admin().storage
        .from("digital-products")
        .createSignedUrl(product.storage_path, 120, { download: filename });
      if (signedError || !signed?.signedUrl) {
        await admin().from("order_items").update({ download_count: item.download_count }).eq("id", item.id);
        throw new Error("Unable to create secure download link");
      }

      await admin().from("download_logs").insert({
        order_item_id: item.id,
        user_id: ctx.user?.id || null,
        ip_address: ctx.ipAddress || null,
        user_agent: ctx.userAgent || null,
      });
      return { url: signed.signedUrl, expires_in: 120 };
    }),

  /* ─── Customer account ─── */
  getMyProfile: authedQuery.query(async ({ ctx }) => {
    const { data, error } = await admin().from("profiles")
      .select("id,full_name,avatar_url,phone,created_at,updated_at")
      .eq("id", ctx.user.id).maybeSingle();
    if (error) throw new Error("Unable to load profile");
    return { ...(data || {}), id: ctx.user.id, email: ctx.user.email || "" };
  }),

  updateMyProfile: authedQuery
    .input(z.object({
      full_name: z.string().trim().min(2).max(100),
      phone: z.string().trim().max(30).optional(),
      avatar_url: z.union([z.string().url(), z.literal("")]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await admin().from("profiles").upsert({
        id: ctx.user.id,
        full_name: input.full_name,
        phone: input.phone || null,
        avatar_url: input.avatar_url || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" }).select("id,full_name,avatar_url,phone,updated_at").single();
      if (error) throw new Error("Unable to update profile");
      return data;
    }),

  listMyOrders: authedQuery.query(async ({ ctx }) => {
    const { data: orders, error } = await admin().from("orders")
      .select("id,status,subtotal,discount_amount,tax_amount,total_amount,paid_at,created_at")
      .eq("user_id", ctx.user.id).order("created_at", { ascending: false });
    if (error) throw new Error("Unable to load orders");
    const ids = (orders || []).map((order: any) => order.id);
    if (!ids.length) return [];
    const { data: items, error: itemsError } = await admin().from("order_items")
      .select("id,order_id,product_id,product_title,quantity,price_at_time,delivery_status,download_count,max_downloads")
      .in("order_id", ids);
    if (itemsError) throw new Error("Unable to load order items");
    return (orders || []).map((order: any) => ({
      ...order,
      items: (items || []).filter((item: any) => item.order_id === order.id),
    }));
  }),

  /* ─── Products ─── */
  listProducts: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(100),
          search: z.string().optional(),
          status: z.enum(["active", "inactive", "all"]).default("active"),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = admin()
        .from("products")
        .select(
          "id,slug,title,title_ar,title_en,description,description_ar,description_en,long_description,long_description_ar,long_description_en,price,original_price,discount_percent,is_on_sale,image_url,in_stock,stock_quantity,is_active,is_featured,is_trending,category_id,product_type,delivery_type,file_type,file_size,features,storage_path,created_at,updated_at"
        )
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.search) query = query.ilike("title", `%${input.search}%`);
      if ((input?.status ?? "active") === "active") query = query.eq("is_active", true);
      if (input?.status === "inactive") query = query.eq("is_active", false);
      const { data, error } = await query;
      if (error) {
        console.error("[listProducts] DB error:", error.message);
        return [];
      }
      return Array.isArray(data) ? data : [];
    }),

  createProduct: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        title_ar: z.string().optional(),
        title_en: z.string().optional(),
        description: z.string().optional(),
        description_ar: z.string().optional(),
        description_en: z.string().optional(),
        long_description: z.string().optional(),
        long_description_ar: z.string().optional(),
        long_description_en: z.string().optional(),
        slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        price: z.number().min(0),
        original_price: z.number().optional(),
        discount_percent: z.number().min(0).max(100).optional(),
        is_on_sale: z.boolean().optional(),
        image_url: z.string().optional(),
        category_id: z.number().default(1),
        product_type: z.enum(["digital_download", "code_delivery", "subscription_account", "smm_service", "manual_service"]).default("digital_download"),
        delivery_type: z.enum(["instant_download", "auto_code", "account_credentials", "api_webhook", "manual_delivery"]).default("instant_download"),
        file_type: z.string().max(20).optional(),
        file_size: z.string().max(40).optional(),
        features: z.array(z.string().min(1).max(160)).max(30).default([]),
        stock_quantity: z.number().int().min(0).nullable().optional(),
        in_stock: z.boolean().default(true),
        is_active: z.boolean().default(true),
        is_featured: z.boolean().default(false),
        is_trending: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;
      const imageUrl =
        input.image_url && input.image_url.trim() !== ""
          ? input.image_url
          : `https://placehold.co/400x400/1a1a2e/FFF?text=${encodeURIComponent(
              input.title.substring(0, 10)
            )}`;

      const { data, error } = await admin()
        .from("products")
        .insert({
          title: input.title,
          title_ar: input.title_ar || input.title,
          title_en: input.title_en || input.title,
          description: input.description ?? "",
          description_ar: input.description_ar || input.description || "",
          description_en: input.description_en || input.description || "",
          long_description: input.long_description || input.long_description_ar || "",
          long_description_ar: input.long_description_ar || input.long_description || "",
          long_description_en: input.long_description_en || input.long_description || "",
          price: input.price,
          original_price: input.original_price ?? input.price,
          discount_percent: input.discount_percent ?? 0,
          is_on_sale: input.is_on_sale ?? false,
          image_url: imageUrl,
          category_id: input.category_id,
          product_type: input.product_type,
          delivery_type: input.delivery_type,
          file_type: input.file_type || "XLSX",
          file_size: input.file_size || "",
          features: input.features,
          stock_quantity: input.stock_quantity ?? null,
          in_stock: input.in_stock,
          is_active: input.is_active,
          is_featured: input.is_featured,
          is_trending: input.is_trending,
          slug: input.slug,
          rating: 5,
          reviews_count: 0,
          added_by: user?.id,
        })
        .select()
        .single();

      if (error) {
        console.error("[createProduct] error:", error.message);
        throw new Error(error.message);
      }

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "create_product",
        productId: data.id,
        productTitle: data.title,
        newValue: { title: data.title, price: data.price },
      });

      return data;
    }),

  updateProduct: adminQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
        title: z.string().optional(),
        title_ar: z.string().optional(),
        title_en: z.string().optional(),
        description: z.string().optional(),
        description_ar: z.string().optional(),
        description_en: z.string().optional(),
        long_description: z.string().optional(),
        long_description_ar: z.string().optional(),
        long_description_en: z.string().optional(),
        price: z.number().optional(),
        original_price: z.number().optional(),
        discount_percent: z.number().min(0).max(100).optional(),
        is_on_sale: z.boolean().optional(),
        image_url: z.string().optional(),
        category_id: z.number().optional(),
        product_type: z.enum(["digital_download", "code_delivery", "subscription_account", "smm_service", "manual_service"]).optional(),
        delivery_type: z.enum(["instant_download", "auto_code", "account_credentials", "api_webhook", "manual_delivery"]).optional(),
        file_type: z.string().max(20).optional(),
        file_size: z.string().max(40).optional(),
        features: z.array(z.string().min(1).max(160)).max(30).optional(),
        stock_quantity: z.number().int().min(0).nullable().optional(),
        in_stock: z.boolean().optional(),
        is_active: z.boolean().optional(),
        is_featured: z.boolean().optional(),
        is_trending: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;
      const { id, ...updateData } = input;

      const { data: oldProduct } = await admin()
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      const { data, error } = await admin()
        .from("products")
        .update({
          ...updateData,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[updateProduct] error:", error.message);
        throw new Error(error.message);
      }

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "update_product",
        productId: id,
        productTitle: data.title,
        oldValue: oldProduct,
        newValue: updateData,
      });

      return data;
    }),

  toggleProduct: adminQuery
    .input(
      z.object({
        id: z.number(),
        field: z.enum(["is_active", "in_stock"]),
        value: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;
      const { data, error } = await admin()
        .from("products")
        .update({ [input.field]: input.value })
        .eq("id", input.id)
        .select()
        .single();
      if (error) {
        console.error("[toggleProduct] error:", error.message);
        throw new Error(error.message);
      }

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "toggle_product",
        productId: input.id,
        productTitle: data.title,
        newValue: { [input.field]: input.value },
      });

      return data;
    }),

  deleteProduct: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;

      const { data: oldProduct } = await admin()
        .from("products")
        .select("*")
        .eq("id", input.id)
        .single();

      const { error } = await admin()
        .from("products")
        .delete()
        .eq("id", input.id);
      if (error) {
        console.error("[deleteProduct] error:", error.message);
        throw new Error(error.message);
      }

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "delete_product",
        productId: input.id,
        productTitle: oldProduct?.title,
        oldValue: oldProduct,
      });

      return { success: true };
    }),

  /* ─── Orders (defensive — no embedded foreign table query) ─── */
  listOrders: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(100),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = admin()
        .from("orders")
        .select(
          "id,customer_name,customer_email,total_amount,status,payment_method,paid_at,created_at"
        )
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.status) query = query.eq("status", input.status);
      const { data, error } = await query;
      if (error) {
        console.error("[listOrders] DB error:", error.message);
        return [];
      }

      const orders = Array.isArray(data) ? data.map((o: any) => ({
        id: o.id,
        order_number: o.id,           // orders table uses "id" as the order number
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        total: o.total_amount,
        status: o.status,
        payment_status: o.paid_at || o.status === 'paid' || o.status === 'completed' ? 'paid' : 'pending',
        created_at: o.created_at,
        items: [] as any[],
      })) : [];

      // Fetch items separately
      if (orders.length > 0) {
        try {
          const orderIds = orders.map((o: any) => o.id);
          const { data: itemsData } = await admin()
            .from("order_items")
            .select("order_id,product_title,quantity,price_at_time")
            .in("order_id", orderIds);
          if (itemsData && itemsData.length > 0) {
            for (const o of orders) {
              o.items = itemsData.filter(
                (item: any) => item.order_id === o.id
              ).map((item: any) => ({ ...item, product_name: item.product_title, price: item.price_at_time }));
            }
          }
        } catch (e: any) {
          console.error("[listOrders] items fetch skipped:", e.message);
        }
      }
      return orders;
    }),

  updateOrderStatus: adminQuery
    .input(
      z.object({
        id: z.string().min(6),
        status: z.enum([
          "pending",
          "processing",
          "completed",
          "cancelled",
          "refunded",
        ]),
        paymentStatus: z
          .enum(["pending", "paid", "failed", "refunded"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: Record<string, string | null> = { status: input.status };
      if (input.paymentStatus === "paid") updateData.paid_at = new Date().toISOString();
      if (input.paymentStatus && input.paymentStatus !== "paid") updateData.paid_at = null;
      const { data, error } = await admin()
        .from("orders")
        .update(updateData)
        .eq("id", input.id)
        .select()
        .single();
      if (error) {
        console.error("[updateOrderStatus] error:", error.message);
        throw new Error(error.message);
      }
      return data;
    }),

  /* ─── Image Upload ─── */
  uploadImage: adminQuery
    .input(
      z.object({
        filename: z.string(),
        base64: z.string(),
        contentType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;
      const supabase = admin();

      let buffer: Buffer;
      try {
        buffer = Buffer.from(input.base64, "base64");
      } catch (e: any) {
        throw new Error("Invalid base64 data: " + e.message);
      }
      if (buffer.length === 0) throw new Error("Empty image data");
      if (buffer.length > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller");
      const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
      if (!allowedImageTypes.has(input.contentType)) throw new Error("Unsupported image type");
      const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(safeFilename, buffer, {
          contentType: input.contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error("[uploadImage] error:", uploadError.message);
        throw new Error("Upload failed: " + uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(safeFilename);

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "upload_image",
        newValue: { filename: safeFilename, url: urlData.publicUrl },
      });

      return { url: urlData.publicUrl };
    }),

  uploadDigitalProduct: adminQuery
    .input(z.object({
      product_id: z.number().int().positive(),
      filename: z.string().min(1).max(160),
      base64: z.string().min(1),
      content_type: z.string().min(1).max(120),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
        throw new Error("Product file must be between 1 byte and 10 MB");
      }
      const extension = input.filename.toLowerCase().split('.').pop() || '';
      const allowedTypes: Record<string, string> = {
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pdf: 'application/pdf',
        zip: 'application/zip',
      };
      if (!allowedTypes[extension]) throw new Error("Only XLSX, PDF, and ZIP product files are allowed");
      if (input.content_type !== allowedTypes[extension] && !(extension === 'zip' && input.content_type === 'application/x-zip-compressed')) {
        throw new Error("File type does not match its extension");
      }
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `${input.product_id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await admin().storage
        .from("digital-products")
        .upload(storagePath, buffer, {
          contentType: allowedTypes[extension],
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      const { error: productError } = await admin()
        .from("products")
        .update({
          storage_path: storagePath,
          download_url: null,
          file_type: extension.toUpperCase(),
          file_size: `${Math.max(1, Math.ceil(buffer.length / 1024))} KB`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.product_id);
      if (productError) {
        await admin().storage.from("digital-products").remove([storagePath]);
        throw new Error("Product record update failed");
      }
      return { storage_path: storagePath, size_bytes: buffer.length };
    }),

  /* ─── Stats (each query independently wrapped) ─── */
  getStats: adminQuery.query(async () => {
    const s = admin();
    let productCount = 0,
      orderCount = 0,
      totalSales = 0,
      customerCount = 0;
    let latestOrders: any[] = [];
    let latestProducts: any[] = [];
    let latestActivity: any[] = [];

    try {
      const { count } = await s
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);
      productCount = count ?? 0;
    } catch (e: any) {
      console.error("[getStats] products:", e.message);
    }

    try {
      const { count } = await s
        .from("orders")
        .select("id", { count: "exact", head: true });
      orderCount = count ?? 0;
    } catch (e: any) {
      console.error("[getStats] orders:", e.message);
    }

    try {
      const { data: salesData } = await s
        .from("orders")
        .select("total_amount")
        .eq("status", "completed");
      totalSales = (salesData ?? []).reduce(
        (sum: number, o: any) => sum + (o.total_amount || 0),
        0
      );
    } catch (e: any) {
      console.error("[getStats] sales:", e.message);
    }

    try {
      const { count } = await s
        .from("profiles")
        .select("id", { count: "exact", head: true });
      customerCount = count ?? 0;
    } catch (e: any) {
      console.error("[getStats] profiles:", e.message);
    }

    try {
      const { data } = await s
        .from("orders")
        .select("id,customer_name,total_amount,status,created_at")
        .order("id", { ascending: false })
        .limit(5);
      latestOrders = (data ?? []).map((o: any) => ({ ...o, order_number: o.id, total: o.total_amount }));
    } catch (e: any) {
      console.error("[getStats] latestOrders:", e.message);
    }

    try {
      const { data } = await s
        .from("products")
        .select("id,title,price,created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);
      latestProducts = data ?? [];
    } catch (e: any) {
      console.error("[getStats] latestProducts:", e.message);
    }

    try {
      const { data } = await s
        .from("admin_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      latestActivity = (data ?? []).map((a: any) => ({
        ...a,
        admin_email: a.admin_email,
        action: a.action,
        product_title: a.entity_type,
        created_at: a.created_at,
      }));
    } catch (e: any) {
      console.error("[getStats] audit logs:", e.message);
    }

    return {
      productCount,
      orderCount,
      totalSales,
      customerCount,
      latestOrders,
      latestProducts,
      latestActivity,
    };
  }),

  /* ─── Activity Logs ─── */
  listActivityLogs: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { data, error } = await admin()
        .from("admin_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 20);
      if (error) {
        console.error("[listActivityLogs] error:", error.message);
        throw new Error(error.message);
      }
      return (data ?? []).map((a: any) => ({
        ...a,
        admin_email: a.admin_email,
        action: a.action,
        product_title: a.entity_type,
        created_at: a.created_at,
      }));
    }),

  /* ─── Customers ─── */
  listCustomers: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(100),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = admin()
        .from("profiles")
        .select("id,full_name,avatar_url,role,created_at")
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.search) query = query.ilike("full_name", `%${input.search}%`);
      const { data, error } = await query;
      if (error) {
        console.error("[listCustomers] DB error:", error.message);
        return [];
      }
      const customers = Array.isArray(data) ? data : [];
      for (const c of customers) {
        c.email = c.full_name ? c.full_name.replace(/\s+/g, '.').toLowerCase() + '@digzoom.com' : 'user@digzoom.com';
        try {
          const { count } = await admin()
            .from("orders")
            .select("id", { count: "exact", head: true })
            .ilike("customer_email", `%${c.full_name || c.id}%`);
          c.order_count = count ?? 0;
        } catch { c.order_count = 0; }
        try {
          const { data: sales } = await admin()
            .from("orders")
            .select("total_amount")
            .eq("status", "completed");
          c.total_spent = (sales ?? []).reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
        } catch { c.total_spent = 0; }
      }
      return customers;
    }),

  /* ─── Coupons (matches ACTUAL schema) ─── */
  listCoupons: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(100),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { data, error } = await admin()
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 100);
      if (error) {
        console.error("[listCoupons] DB error:", error.message);
        return [];
      }
      return (Array.isArray(data) ? data : []).map((c: any) => ({
        ...c,
        used_count: c.used_count || 0,
      }));
    }),

  createCoupon: adminQuery
    .input(
      z.object({
        code: z.string().min(1),
        discount_percent: z.number().min(0).max(100),
        max_uses: z.number().min(1).optional(),
        valid_until: z.string().optional(),
        min_order_amount: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (ctx as any).user;
      const { data, error } = await admin()
        .from("coupons")
        .insert({
          code: input.code.toUpperCase(),
          discount_percent: input.discount_percent,
          max_uses: input.max_uses || null,
          valid_until: input.valid_until || null,
          min_order_amount: input.min_order_amount || 0,
          used_count: 0,
          is_active: true,
          is_public: false,
          created_by: user?.id || null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "create_coupon",
        newValue: { code: data.code, discount_percent: data.discount_percent },
      });
      return data;
    }),

  toggleCoupon: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { data: current } = await admin()
        .from("coupons")
        .select("is_active")
        .eq("id", input.id)
        .single();
      const { data, error } = await admin()
        .from("coupons")
        .update({ is_active: !current?.is_active })
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),

  deleteCoupon: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await admin()
        .from("coupons")
        .delete()
        .eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /* ─── Reviews ─── */
  listReviews: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(100),
          productId: z.number().optional(),
          status: z.enum(["approved", "pending", "all"]).default("all"),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = admin()
        .from("reviews")
        .select("*,products(title)")
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.productId) query = query.eq("product_id", input.productId);
      if (input?.status === "approved") query = query.eq("is_approved", true);
      if (input?.status === "pending") query = query.eq("is_approved", false);
      const { data, error } = await query;
      if (error) {
        console.error("[listReviews] DB error:", error.message);
        return [];
      }
      return Array.isArray(data) ? data : [];
    }),

  approveReview: adminQuery
    .input(z.object({ id: z.number(), approve: z.boolean() }))
    .mutation(async ({ input }) => {
      const { data, error } = await admin()
        .from("reviews")
        .update({ is_approved: input.approve })
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),

  deleteReview: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await admin()
        .from("reviews")
        .delete()
        .eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /* ─── Product Images ─── */
  listProductImages: adminQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await admin()
        .from("product_images")
        .select("*")
        .eq("product_id", input.productId)
        .order("sort_order", { ascending: true });
      if (error) {
        console.error("[listProductImages] DB error:", error.message);
        return [];
      }
      return Array.isArray(data) ? data : [];
    }),

  addProductImage: adminQuery
    .input(
      z.object({
        productId: z.number(),
        imageUrl: z.string().min(1),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      if (input.isPrimary) {
        await admin()
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", input.productId);
      }
      const { data, error } = await admin()
        .from("product_images")
        .insert({
          product_id: input.productId,
          image_url: input.imageUrl,
          is_primary: input.isPrimary,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),

  removeProductImage: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await admin()
        .from("product_images")
        .delete()
        .eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  setPrimaryImage: adminQuery
    .input(z.object({ id: z.number(), productId: z.number() }))
    .mutation(async ({ input }) => {
      await admin()
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", input.productId);
      const { data, error } = await admin()
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),

  /* ─── Analytics ─── */
  getAnalytics: adminQuery.query(async () => {
    const s = admin();
    const result: any = {
      productCount: 0,
      orderCount: 0,
      totalSales: 0,
      customerCount: 0,
      reviewCount: 0,
      avgRating: 0,
      viewsToday: 0,
      viewsWeek: 0,
      viewsMonth: 0,
      topProducts: [],
      mostViewed: [],
      salesByDay: [],
      ordersByStatus: {},
    };

    try {
      const { count } = await s.from("products").select("id", { count: "exact", head: true });
      result.productCount = count ?? 0;
    } catch {}
    try {
      const { count } = await s.from("orders").select("id", { count: "exact", head: true });
      result.orderCount = count ?? 0;
    } catch {}
    try {
      const { count } = await s.from("profiles").select("id", { count: "exact", head: true });
      result.customerCount = count ?? 0;
    } catch {}
    try {
      const { count } = await s.from("reviews").select("id", { count: "exact", head: true });
      result.reviewCount = count ?? 0;
    } catch {}
    try {
      const { data: sales } = await s.from("orders").select("total_amount").eq("status", "completed");
      result.totalSales = (sales ?? []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    } catch {}
    try {
      const { data: ratings } = await s.from("reviews").select("rating").eq("is_approved", true);
      const r = ratings ?? [];
      result.avgRating = r.length > 0 ? r.reduce((s: number, x: any) => s + x.rating, 0) / r.length : 0;
    } catch {}

    // Views
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    try {
      const { count } = await s.from("product_views").select("id", { count: "exact", head: true }).gte("viewed_at", dayAgo);
      result.viewsToday = count ?? 0;
    } catch {}
    try {
      const { count } = await s.from("product_views").select("id", { count: "exact", head: true }).gte("viewed_at", weekAgo);
      result.viewsWeek = count ?? 0;
    } catch {}
    try {
      const { count } = await s.from("product_views").select("id", { count: "exact", head: true }).gte("viewed_at", monthAgo);
      result.viewsMonth = count ?? 0;
    } catch {}

    // Top selling products
    try {
      const { data: top } = await s.from("order_items").select("product_title,quantity,price_at_time,product_id").limit(10);
      result.topProducts = (top ?? []).slice(0, 5).map((item: any) => ({ ...item, product_name: item.product_title, price: item.price_at_time }));
    } catch {}

    // Most viewed
    try {
      const { data } = await s.from("product_views").select("product_id,count").limit(5);
      result.mostViewed = data ?? [];
    } catch {}

    // Sales by day (last 7 days)
    try {
      const { data } = await s.from("orders").select("total_amount,created_at,status").gte("created_at", weekAgo);
      const dayMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dayMap[d.toISOString().split('T')[0]] = 0;
      }
      for (const o of (data ?? [])) {
        const day = o.created_at?.split('T')[0];
        if (day && dayMap[day] !== undefined) dayMap[day] += o.total_amount || 0;
      }
      result.salesByDay = Object.entries(dayMap).map(([date, sales]) => ({ date, sales }));
    } catch {}

    // Orders by status
    try {
      const { data } = await s.from("orders").select("status");
      const counts: Record<string, number> = {};
      for (const o of (data ?? [])) { counts[o.status] = (counts[o.status] || 0) + 1; }
      result.ordersByStatus = counts;
    } catch {}

    return result;
  }),
});

export type AdminRouter = typeof adminRouter;
