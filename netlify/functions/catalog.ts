import type { Handler } from "@netlify/functions";
import { getSupabaseAdmin } from "../lib/supabase-admin";

// The public catalog is served from this origin so embedded mobile browsers
// need only reach digzoom.com. Never return storage or delivery credentials.
export const handler: Handler = async event => {
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Method not allowed" };
  try {
    const database = getSupabaseAdmin();
    const [productResult, categoryResult] = await Promise.all([
      database.from("products")
        .select("id,slug,title,title_ar,title_en,description,description_ar,description_en,long_description,long_description_ar,long_description_en,price,original_price,category_id,product_type,delivery_type,image_url,file_type,file_size,features,rating,reviews_count,in_stock,stock_quantity,is_active,is_featured,is_trending,requires_customer_input,storage_path,download_url")
        .eq("is_active", true).order("id", { ascending: true }),
      database.from("categories")
        .select("id,slug,name_ar,name_en,icon,sort_order,is_active")
        .eq("is_active", true).order("sort_order", { ascending: true }),
    ]);
    if (productResult.error || categoryResult.error) {
      console.error("[catalog] database error", productResult.error, categoryResult.error);
      throw new Error("Catalog unavailable");
    }
    const products = (productResult.data || []).map(({ storage_path, download_url, ...product }) => ({
      ...product,
      // Preserve the UI's ready/absent indicator without publishing either path.
      storage_path: storage_path ? "ready" : null,
      download_url: download_url ? "ready" : null,
    }));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
      body: JSON.stringify({ products, categories: categoryResult.data || [] }),
    };
  } catch (error) {
    console.error("[catalog] unable to load catalog", error);
    return { statusCode: 503, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify({ error: "Catalog temporarily unavailable" }) };
  }
};
