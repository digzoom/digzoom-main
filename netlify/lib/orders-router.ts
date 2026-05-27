import { z } from "zod";
import { createRouter, adminQuery } from "./trpc";
import { getSupabaseAdmin } from "./supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any { return getSupabaseAdmin(); }

export const ordersRouter = createRouter({
  // List all orders (admin only)
  listOrders: adminQuery
    .input(z.object({ limit: z.number().min(1).max(500).default(100), status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let query = admin()
        .from("orders")
        .select("id,order_number,customer_name,customer_email,total,status,payment_status,created_at")
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);

      if (input?.status) {
        query = query.eq("status", input.status);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as Array<{
        id: number; order_number: string; customer_name: string;
        customer_email: string; total: number; status: string;
        payment_status: string; created_at: string;
      }>;
    }),

  // Get order with items
  getOrderById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { data: order, error: orderError } = await admin()
        .from("orders")
        .select("*")
        .eq("id", input.id)
        .single();

      if (orderError) throw new Error(orderError.message);

      const { data: items, error: itemsError } = await admin()
        .from("order_items")
        .select("product_name,quantity,price")
        .eq("order_id", input.id);

      if (itemsError) throw new Error(itemsError.message);

      return { ...order, items: items ?? [] } as Record<string, unknown> & {
        items: Array<{ product_name: string; quantity: number; price: number }>;
      };
    }),

  // Update order status
  updateOrderStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]),
      paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    }))
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

  // Delete order + items
  deleteOrder: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Delete items first (FK constraint)
      const { error: itemsError } = await admin()
        .from("order_items")
        .delete()
        .eq("order_id", input.id);

      if (itemsError) throw new Error(itemsError.message);

      const { error } = await admin()
        .from("orders")
        .delete()
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
