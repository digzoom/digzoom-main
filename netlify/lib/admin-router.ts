import { z } from "zod";
import { createRouter, adminQuery } from "./trpc";
import { getSupabaseAdmin } from "./supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any { return getSupabaseAdmin(); }

export const adminRouter = createRouter({
  /* ─── Products ─── */
  listProducts: adminQuery
    .input(z.object({ limit: z.number().min(1).max(500).default(100), search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let query = admin().from("products").select("id,title,price,image_url,in_stock,is_active,category_id,created_at,description").order("id", { ascending: false }).limit(input?.limit ?? 100);
      if (input?.search) query = query.ilike("title", `%${input.search}%`);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as Array<{
        id: number; title: string; price: number; image_url: string; description: string;
        in_stock: boolean; is_active: boolean; category_id: number; created_at: string;
      }>;
    }),

  createProduct: adminQuery
    .input(z.object({
      title: z.string().min(1), description: z.string().optional(),
      price: z.number().min(0), image_url: z.string().optional(),
      category_id: z.number().default(1), in_stock: z.boolean().default(true), is_active: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await admin().from("products").insert({
        title: input.title,
        description: input.description ?? "",
        price: input.price,
        image_url: input.image_url && input.image_url.trim() !== "" ? input.image_url : "https://placehold.co/400x400/1a1a2e/FFF?text=" + encodeURIComponent(input.title.substring(0, 10)),
        category_id: input.category_id ?? 1,
        in_stock: input.in_stock,
        is_active: input.is_active,
        slug: "p-" + Date.now(),
        features: [],
        file_type: "ZIP",
        file_size: "10 MB",
        rating: 5,
        reviews_count: 0,
      }).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),

  updateProduct: adminQuery
    .input(z.object({
      id: z.number(), title: z.string().optional(), description: z.string().optional(),
      price: z.number().optional(), image_url: z.string().optional(),
      category_id: z.number().optional(), in_stock: z.boolean().optional(), is_active: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const { data, error } = await admin().from("products").update(updateData).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),

  toggleProduct: adminQuery
    .input(z.object({ id: z.number(), field: z.enum(["is_active", "in_stock"]), value: z.boolean() }))
    .mutation(async ({ input }) => {
      const { data, error } = await admin().from("products").update({ [input.field]: input.value }).eq("id", input.id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),

  deleteProduct: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await admin().from("products").delete().eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /* ─── Orders ─── */
  listOrders: adminQuery
    .input(z.object({ limit: z.number().min(1).max(500).default(100), status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let query = admin()
        .from("orders")
        .select("id,order_number,customer_name,customer_email,total,status,payment_status,created_at,items:order_items(product_name,quantity,price)")
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);

      if (input?.status) query = query.eq("status", input.status);

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      // Normalize the nested items format
      const normalized = (data ?? []).map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        total: o.total,
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        items: Array.isArray(o.items) ? o.items : [],
      }));

      return normalized as Array<{
        id: number; order_number: string; customer_name: string;
        customer_email: string; total: number; status: string;
        payment_status: string; created_at: string;
        items: Array<{ product_name: string; quantity: number; price: number }>;
      }>;
    }),

  getOrderById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { data: order, error: orderError } = await admin().from("orders").select("*").eq("id", input.id).single();
      if (orderError) throw new Error(orderError.message);

      const { data: items, error: itemsError } = await admin().from("order_items").select("product_name,quantity,price").eq("order_id", input.id);
      if (itemsError) throw new Error(itemsError.message);

      return { ...order, items: items ?? [] };
    }),

  updateOrderStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]),
      paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const updateData: Record<string, string> = { status: input.status };
      if (input.paymentStatus) updateData.payment_status = input.paymentStatus;

      const { data, error } = await admin().from("orders").update(updateData).eq("id", input.id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),

  deleteOrder: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error: itemsError } = await admin().from("order_items").delete().eq("order_id", input.id);
      if (itemsError) throw new Error(itemsError.error);

      const { error } = await admin().from("orders").delete().eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
