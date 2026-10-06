import { vi } from 'vitest';

export function queryResult(data: unknown, error: unknown = null) {
  const result = { data, error };
  const query = {
    select: vi.fn(), eq: vi.fn(), neq: vi.fn(), in: vi.fn(), is: vi.fn(), gte: vi.fn(),
    lt: vi.fn(), contains: vi.fn(), update: vi.fn(), insert: vi.fn(),
    order: vi.fn(), limit: vi.fn(),
    maybeSingle: vi.fn(async () => result),
    single: vi.fn(async () => result),
    then: (resolve: (value: typeof result) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(result).then(resolve, reject),
  };
  for (const method of ['select', 'eq', 'neq', 'in', 'is', 'gte', 'lt', 'contains', 'update', 'insert', 'order', 'limit'] as const) {
    query[method].mockReturnValue(query);
  }
  return query;
}
