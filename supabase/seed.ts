#!/usr/bin/env node
/**
 * DigZoom Product Seed Script
 * Reads products from src/data/products.ts and inserts into Supabase via REST API
 */

import { products } from '../src/data/products.js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const categoryMap: Record<string, number> = {
  'graphics': 1, 'fonts': 2, 'templates': 3, 'videos': 4, 'pdf': 5,
  'audio': 6, 'code': 7, 'web': 8, '3d': 9, 'photos': 10,
};

async function postgrestInsert(batch: any[]) {
  const res = await fetch(`${url}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(batch),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
  return res;
}

async function seed() {
  console.log(`🔄 Migrating ${products.length} products to Supabase...\n`);

  let success = 0;
  let failed = 0;

  const batchSize = 50;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    const rows = batch.map(p => ({
      id: p.id,
      slug: p.id.toString(),
      title: p.title,
      description: p.description,
      long_description: p.longDescription || p.description,
      price: p.price,
      original_price: p.originalPrice || null,
      category_id: categoryMap[p.category] || null,
      product_type: 'digital_download',
      delivery_type: 'instant_download',
      image_url: p.image,
      file_type: p.fileType || 'ZIP',
      file_size: p.fileSize || '10 MB',
      features: p.features || [],
      rating: p.rating,
      reviews_count: p.reviews || 0,
      in_stock: p.inStock !== false,
      is_active: true,
      is_featured: p.isFeatured || false,
      is_trending: p.isTrending || false,
      requires_customer_input: false,
      customer_input_schema: {},
      delivery_config: {},
      download_url: p.downloadUrl || null,
      storage_path: null,
    }));

    try {
      await postgrestInsert(rows);
      console.log(`✅ Batch ${i + 1}-${Math.min(i + batch.length, products.length)} inserted`);
      success += batch.length;
    } catch (err: any) {
      console.error(`❌ Batch ${i}-${i + batch.length} failed:`, err.message);
      failed += batch.length;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📊 Results:`);
  console.log(`   Success: ${success}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   Total:   ${products.length}`);

  // Verify
  const res = await fetch(`${url}/rest/v1/products?select=count`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });
  if (res.ok) {
    const data = await res.json();
    console.log(`\n📦 Total products in database: ${data[0]?.count || '?'}`);
  }
}

seed().catch(console.error);
