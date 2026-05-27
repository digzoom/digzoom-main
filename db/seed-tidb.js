import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'E2nTvuo5qwi7ynE.root',
  password: 'UYmnUuJ6oAUgT8wq',
  database: 'test',
  ssl: { rejectUnauthorized: true },
  connectionLimit: 1,
});

async function seed() {
  // Categories
  const cats = [
    ['ebooks', 'كتب إلكترونية', 'E-Books', 'BookOpen', '#3b82f6', 43],
    ['videos', 'فيديوهات', 'Videos', 'Video', '#ef4444', 27],
    ['templates', 'قوالب', 'Templates', 'Layout', '#8b5cf6', 25],
    ['fonts', 'خطوط', 'Fonts', 'Type', '#ec4899', 25],
    ['graphics', 'جرافيكس', 'Graphics', 'Palette', '#f59e0b', 33],
    ['3d-models', 'نماذج 3D', '3D Models', 'Box', '#10b981', 28],
    ['photos', 'صور', 'Photos', 'Camera', '#06b6d4', 33],
    ['code', 'أكواد', 'Code', 'Code', '#f97316', 28],
    ['web-design', 'تصميم ويب', 'Web Design', 'Globe', '#6366f1', 26],
    ['audio', 'صوتيات', 'Audio', 'Music', '#14b8a6', 32],
  ];
  for (const c of cats) {
    await pool.query('INSERT IGNORE INTO categories (slug, name_ar, name_en, icon, color, product_count) VALUES (?,?,?,?,?,?)', c);
  }
  console.log('✅ 10 categories seeded');

  // Products
  const prods = [
    ['cinematic-wedding-templates', 'قوالب فيديو الزفاف السينمائي', 'Cinematic Wedding Templates', 'مجموعة احترافية من قوالب فيديو الزفاف بجودة سينمائية', 'Professional cinematic wedding video templates', 189, 379, 50, '/images/products/wedding.jpg', 2, 'AE, PR', '12 GB', '["4K Quality","50+ Templates"]', 4.9, 289, 1543],
    ['yoga-meditation-videos', 'فيديوهات اليوجا والتأمل 4K', 'Yoga & Meditation 4K', 'فيديوهات احترافية لليوجا والتأمل بدقة 4K', 'Professional yoga and meditation videos in 4K', 169, 339, 50, '/images/products/yoga.jpg', 2, 'MP4', '8 GB', '["4K Resolution","100+ Videos"]', 4.8, 234, 987],
    ['ecommerce-encyclopedia', 'موسوعة التجارة الإلكترونية الشاملة', 'E-Commerce Encyclopedia', 'دليلك الشامل لبناء متجر إلكتروني ناجح من الصفر', 'Complete guide to building a successful online store', 99, 199, 50, '/images/products/ecommerce.jpg', 1, 'PDF', '45 MB', '["500+ Pages","Case Studies"]', 4.9, 823, 3456],
    ['digital-marketing-guide', 'دليل التسويق الرقمي 2025', 'Digital Marketing Guide 2025', 'أحدث استراتيجيات التسويق الرقمي لعام 2025', 'Latest digital marketing strategies for 2025', 79, 159, 50, '/images/products/marketing.jpg', 1, 'PDF', '32 MB', '["2025 Updated","SEO"]', 4.8, 567, 2134],
    ['islamic-calligraphy', 'مجموعة الخط العربي الإسلامي', 'Islamic Calligraphy Collection', 'مجموعة فاخرة من الخطوط العربية الإسلامية', 'Premium Islamic Arabic calligraphy collection', 149, 299, 50, '/images/products/calligraphy.jpg', 4, 'OTF, TTF', '250 MB', '["50+ Fonts","Islamic"]', 4.9, 445, 1876],
    ['ai-tools-collection', 'مجموعة أدوات الذكاء الاصطناعي', 'AI Tools Collection', 'أدوات وتطبيقات الذكاء الاصطناعي للمحترفين', 'AI tools and applications for professionals', 199, 399, 50, '/images/products/ai-tools.jpg', 8, 'Various', '3 GB', '["AI Prompts","Scripts"]', 4.9, 678, 2345],
  ];
  for (const p of prods) {
    await pool.query('INSERT IGNORE INTO products (slug, title_ar, title_en, description_ar, description_en, price, original_price, discount, image, category_id, file_type, file_size, features, rating, review_count, sales_count, is_featured, in_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,TRUE,TRUE)', p);
  }
  console.log('✅ 6 products seeded');

  await pool.end();
  console.log('✅ Seed complete');
}

seed().catch(e => { console.error(e.message); pool.end(); });
