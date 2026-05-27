import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { pageViews, events } from "@db/schema";
import { desc, sql, gte } from "drizzle-orm";

export const analyticsRouter = createRouter({
  // Track page view
  trackPageView: publicQuery
    .input(
      z.object({
        page: z.string(),
        sessionId: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        device: z.string().optional(),
        browser: z.string().optional(),
        referer: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;
      const ip = ctx.req.headers.get("x-forwarded-for") || ctx.req.headers.get("x-real-ip");

      await db.insert(pageViews).values({
        page: input.page,
        sessionId: input.sessionId,
        userId: userId ?? undefined,
        ip: ip ?? undefined,
        country: input.country,
        city: input.city,
        device: input.device,
        browser: input.browser,
        referer: input.referer,
      });

      return { success: true };
    }),

  // Track event
  trackEvent: publicQuery
    .input(
      z.object({
        eventName: z.string(),
        eventData: z.record(z.string(), z.any()).optional(),
        sessionId: z.string().optional(),
        page: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      await db.insert(events).values({
        eventName: input.eventName,
        eventData: input.eventData,
        sessionId: input.sessionId,
        userId: userId ?? undefined,
        page: input.page,
      });

      return { success: true };
    }),

  // Get dashboard stats (admin only)
  getStats: adminQuery.query(async () => {
    const db = getDb();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total page views today
    const todayViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, today));

    // Total page views all time
    const totalViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageViews);

    // Unique sessions today
    const todaySessions = await db
      .select({ count: sql<number>`count(distinct ${pageViews.sessionId})` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, today));

    // Top pages
    const topPages = await db
      .select({
        page: pageViews.page,
        views: sql<number>`count(*)`,
      })
      .from(pageViews)
      .groupBy(pageViews.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Top countries
    const topCountries = await db
      .select({
        country: pageViews.country,
        views: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(sql`${pageViews.country} is not null`)
      .groupBy(pageViews.country)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Recent events
    const recentEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(50);

    return {
      todayViews: todayViews[0]?.count ?? 0,
      totalViews: totalViews[0]?.count ?? 0,
      todaySessions: todaySessions[0]?.count ?? 0,
      topPages,
      topCountries,
      recentEvents,
    };
  }),

  // Get page views over time (for charts)
  getPageViewsOverTime: adminQuery
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const result = await db
        .select({
          date: sql<string>`date(${pageViews.createdAt})`,
          views: sql<number>`count(*)`,
          uniqueSessions: sql<number>`count(distinct ${pageViews.sessionId})`,
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, startDate))
        .groupBy(sql`date(${pageViews.createdAt})`)
        .orderBy(sql`date(${pageViews.createdAt})`);

      return result;
    }),
});
