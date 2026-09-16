import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getSupabaseAdmin } from "./lib/supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAdmin(): any {
  return getSupabaseAdmin();
}

export const supabaseAdminRouter = createRouter({
  listProducts: adminQuery
    .input(
      z.object({
        limit: z.number().min(1).max(500).default(100),
        search: z.string().optional(),
        status: z.enum(["active", "inactive", "all"]).default("active"),
      }).optional()
    )
    .query(async ({ input }) => {
      const admin = getAdmin();
      let query = admin
        .from("products")
        .select("id,title,description,price,original_price,discount_percent,is_on_sale,image_url,in_stock,is_active,category_id,created_at")
        .order("is_active", { ascending: false })
        .order("id", { ascending: false })
        .limit(input?.limit ?? 100);

      if ((input?.status ?? "active") === "active") {
        query = query.eq("is_active", true);
      } else if (input?.status === "inactive") {
        query = query.eq("is_active", false);
      }

      if (input?.search) {
        query = query.ilike("title", `%${input.search}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data as Array<{
        id: number; title: string; description: string | null; price: number;
        original_price: number | null; discount_percent: number | null;
        is_on_sale: boolean;
        image_url: string; in_stock: boolean;
        is_active: boolean; category_id: number; created_at: string;
      }>) ?? [];
    }),

  createProduct: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        image_url: z.string().optional(),
        category_id: z.number().default(1),
        in_stock: z.boolean().default(true),
        is_active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const admin = getAdmin();
      const { data, error } = await admin
        .from("products")
        .insert({
          title: input.title,
          description: input.description,
          price: input.price,
          image_url: input.image_url,
          category_id: input.category_id,
          in_stock: input.in_stock,
          is_active: input.is_active,
          slug: "p-" + Date.now(),
          features: [],
          file_type: "ZIP",
          file_size: "10 MB",
          rating: 5,
          reviews_count: 0,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  updateProduct: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        image_url: z.string().optional(),
        category_id: z.number().optional(),
        in_stock: z.boolean().optional(),
        is_active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const admin = getAdmin();
      const { data, error } = await admin
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  deleteProduct: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const admin = getAdmin();
      const { error } = await admin
        .from("products")
        .delete()
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  toggleProduct: adminQuery
    .input(
      z.object({
        id: z.number(),
        field: z.enum(["is_active", "in_stock"]),
        value: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const admin = getAdmin();
      const { data, error } = await admin
        .from("products")
        .update({ [input.field]: input.value })
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),
});
