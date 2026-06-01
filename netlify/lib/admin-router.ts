import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./trpc";
import { getSupabaseAdmin } from "./supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any { return getSupabaseAdmin(); }

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

  /* ─── Products ─── */
  listProducts: adminQuery
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
        .from("products")
        .select(
          "id,title,price,original_price,discount_percent,is_on_sale,image_url,in_stock,is_active,category_id,created_at,updated_at,description"
        )
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.search) query = query.ilike("title", `%${input.search}%`);
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
        description: z.string().optional(),
        price: z.number().min(0),
        original_price: z.number().optional(),
        discount_percent: z.number().min(0).max(100).optional(),
        is_on_sale: z.boolean().optional(),
        image_url: z.string().optional(),
        category_id: z.number().default(1),
        in_stock: z.boolean().default(true),
        is_active: z.boolean().default(true),
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
          description: input.description ?? "",
          price: input.price,
          original_price: input.original_price ?? input.price,
          discount_percent: input.discount_percent ?? 0,
          is_on_sale: input.is_on_sale ?? false,
          image_url: imageUrl,
          category_id: input.category_id,
          in_stock: input.in_stock,
          is_active: input.is_active,
          slug: "p-" + Date.now(),
          features: [],
          file_type: "ZIP",
          file_size: "10 MB",
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
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        original_price: z.number().optional(),
        discount_percent: z.number().min(0).max(100).optional(),
        is_on_sale: z.boolean().optional(),
        image_url: z.string().optional(),
        category_id: z.number().optional(),
        in_stock: z.boolean().optional(),
        is_active: z.boolean().optional(),
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
          "id,order_number,customer_name,customer_email,total_amount,status,payment_status,created_at"
        )
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);
      if (input?.status) query = query.eq("status", input.status);
      const { data, error } = await query;
      if (error) {
        console.error("[listOrders] DB error:", error.message);
        return [];
      }

      const orders = Array.isArray(data) ? data.map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        total: o.total_amount,
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        items: [] as any[],
      })) : [];

      // Fetch items separately
      if (orders.length > 0) {
        try {
          const orderIds = orders.map((o: any) => o.id);
          const { data: itemsData } = await admin()
            .from("order_items")
            .select("order_id,product_name,quantity,price")
            .in("order_id", orderIds);
          if (itemsData && itemsData.length > 0) {
            for (const o of orders) {
              o.items = itemsData.filter(
                (item: any) => item.order_id === o.id
              );
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
        id: z.number(),
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
      const updateData: Record<string, string> = { status: input.status };
      if (input.paymentStatus) updateData.payment_status = input.paymentStatus;
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

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(input.filename, buffer, {
          contentType: input.contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error("[uploadImage] error:", uploadError.message);
        throw new Error("Upload failed: " + uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(input.filename);

      logActivity({
        adminEmail: user?.email || "unknown",
        adminId: user?.id,
        action: "upload_image",
        newValue: { filename: input.filename, url: urlData.publicUrl },
      });

      return { url: urlData.publicUrl };
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
        .select("id", { count: "exact", head: true });
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
        .select("id,order_number,customer_name,total_amount,status,created_at")
        .order("id", { ascending: false })
        .limit(5);
      latestOrders = (data ?? []).map((o: any) => ({ ...o, total: o.total_amount }));
    } catch (e: any) {
      console.error("[getStats] latestOrders:", e.message);
    }

    try {
      const { data } = await s
        .from("products")
        .select("id,title,price,created_at")
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
          used_count: 0,
          is_active: true,
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
      const { data: top } = await s.from("order_items").select("product_name,quantity,price,product_id").limit(10);
      result.topProducts = (top ?? []).slice(0, 5);
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
