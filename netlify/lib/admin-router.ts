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
    await admin().from("admin_activity_logs").insert({
      admin_email: data.adminEmail,
      admin_id: data.adminId,
      action: data.action,
      product_id: data.productId,
      product_title: data.productTitle,
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
          "id,title,price,original_price,discount_percent,is_on_sale,image_url,in_stock,is_active,category_id,created_at,updated_at,description,added_by,updated_by"
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

      if (error) throw new Error(error.message);

      // Fire-and-forget audit log (don't block response)
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

      if (error) throw new Error(error.message);

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
      if (error) throw new Error(error.message);

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
      if (error) throw new Error(error.message);

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
          "id,order_number,customer_name,customer_email,total,status,payment_status,created_at"
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
        total: o.total,
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        items: [] as any[],
      }));

      // Fetch items separately (more compatible than embedded query)
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
      if (error) throw new Error(error.message);
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

      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

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
        .select("total")
        .eq("status", "completed");
      totalSales = (salesData ?? []).reduce(
        (sum: number, o: any) => sum + (o.total || 0),
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
        .select("id,order_number,customer_name,total,status,created_at")
        .order("id", { ascending: false })
        .limit(5);
      latestOrders = data ?? [];
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
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      latestActivity = data ?? [];
    } catch (e: any) {
      console.error("[getStats] activity:", e.message);
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
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(input?.limit ?? 20);
      if (error) {
        console.error("[listActivityLogs] DB error:", error.message);
        return [];
      }
      return Array.isArray(data) ? data : [];
    }),
});
