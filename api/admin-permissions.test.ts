import { describe, expect, it } from 'vitest';
import { adminRouter } from '../netlify/lib/admin-router';

describe('administrative read access boundaries', () => {
  const procedures = ['listProducts', 'listOrders', 'getStats', 'listCustomers', 'listCoupons', 'listReviews', 'listActivityLogs', 'getAnalytics'] as const;
  for (const name of procedures) {
    it(`${name} rejects an anonymous caller`, async () => {
      const caller = adminRouter.createCaller({});
      await expect((caller[name] as Function)()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
    it(`${name} rejects an ordinary authenticated user`, async () => {
      const caller = adminRouter.createCaller({ user: { id: 'permission-test', role: 'user' } });
      await expect((caller[name] as Function)()).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });
  }
});
