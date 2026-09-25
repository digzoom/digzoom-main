import type { Category, Product } from "@/types/database";

export async function fetchCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const response = await fetch("/api/catalog", { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("Catalog unavailable");
  const data = await response.json();
  if (!Array.isArray(data.products) || !Array.isArray(data.categories))
    throw new Error("Invalid catalog response");
  return data;
}
