import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, categories } from "@db/schema";
import { eq, desc, like, and } from "drizzle-orm";

export const productsRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }
      if (input?.search) {
        conditions.push(like(products.titleAr, `%${input.search}%`));
      }
      if (input?.featured) {
        conditions.push(eq(products.isFeatured, true));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.createdAt))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);

      const total = await db
        .select({ count: products.id })
        .from(products)
        .where(where);

      return {
        items,
        total: total.length,
      };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        slug: z.string().min(1),
        titleAr: z.string().min(1),
        titleEn: z.string().min(1),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        longDescriptionAr: z.string().optional(),
        longDescriptionEn: z.string().optional(),
        price: z.number().min(0),
        originalPrice: z.number().optional(),
        discount: z.number().min(0).max(100).optional(),
        image: z.string().optional(),
        categoryId: z.number().optional(),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        features: z.array(z.string()).optional(),
        downloadUrl: z.string().optional(),
        inStock: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        ...input,
        price: input.price.toString(),
        originalPrice: input.originalPrice?.toString(),
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().optional(),
        titleAr: z.string().optional(),
        titleEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        price: z.number().optional(),
        originalPrice: z.number().optional(),
        discount: z.number().optional(),
        image: z.string().optional(),
        categoryId: z.number().optional(),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        features: z.array(z.string()).optional(),
        downloadUrl: z.string().optional(),
        inStock: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      const result = await db
        .update(products)
        .set({
          ...data,
          price: data.price?.toString(),
          originalPrice: data.originalPrice?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(products.id, id));
      return result;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});

// Categories router
export const categoriesRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories).orderBy(categories.nameAr);
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),
});
