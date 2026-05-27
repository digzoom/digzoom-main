import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { coupons } from "@db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export const couponsRouter = createRouter({
  list: adminQuery
    .input(
      z.object({
        search: z.string().optional(),
        active: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.search) {
        conditions.push(eq(coupons.code, input.search.toUpperCase()));
      }
      if (input?.active !== undefined) {
        conditions.push(eq(coupons.isActive, input.active));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(coupons)
        .where(where)
        .orderBy(desc(coupons.createdAt))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);

      const total = await db
        .select({ count: coupons.id })
        .from(coupons)
        .where(where);

      return {
        items,
        total: total.length,
      };
    }),

  getByCode: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, input.code.toUpperCase()))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        code: z.string().min(1).max(50),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.number().min(0),
        minOrderAmount: z.number().min(0).default(0),
        maxUses: z.number().min(1).optional(),
        expiresAt: z.string().optional(),
        isActive: z.boolean().default(true),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(coupons).values({
        code: input.code.toUpperCase(),
        discountType: input.discountType,
        discountValue: input.discountValue.toString(),
        minOrderAmount: input.minOrderAmount.toString(),
        maxUses: input.maxUses ?? null,
        usedCount: 0,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        isActive: input.isActive,
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        discountValue: z.number().optional(),
        minOrderAmount: z.number().optional(),
        maxUses: z.number().optional(),
        expiresAt: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      const updateData: any = {};

      if (data.code !== undefined) updateData.code = data.code.toUpperCase();
      if (data.discountType !== undefined) updateData.discountType = data.discountType;
      if (data.discountValue !== undefined) updateData.discountValue = data.discountValue.toString();
      if (data.minOrderAmount !== undefined) updateData.minOrderAmount = data.minOrderAmount.toString();
      if (data.maxUses !== undefined) updateData.maxUses = data.maxUses;
      if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      await db
        .update(coupons)
        .set(updateData)
        .where(eq(coupons.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(coupons).where(eq(coupons.id, input.id));
      return { success: true };
    }),

  toggle: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(coupons).where(eq(coupons.id, input.id)).limit(1);
      if (!existing[0]) throw new Error("Coupon not found");
      await db
        .update(coupons)
        .set({ isActive: !existing[0].isActive })
        .where(eq(coupons.id, input.id));
      return { success: true, isActive: !existing[0].isActive };
    }),
});
