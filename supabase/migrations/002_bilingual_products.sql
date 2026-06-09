-- ============================================
-- Bilingual Products: Add English columns
-- ============================================

-- Add English title/description columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT,
  ADD COLUMN IF NOT EXISTS long_description_en TEXT,
  ADD COLUMN IF NOT EXISTS long_description_ar TEXT;

-- Copy existing Arabic data to explicit _ar columns
UPDATE products SET title_ar = title WHERE title_ar IS NULL;
UPDATE products SET description_ar = description WHERE description_ar IS NULL;
UPDATE products SET long_description_ar = long_description WHERE long_description_ar IS NULL;

-- ============================================
-- English translations for featured products
-- Run after columns are added
-- ============================================

UPDATE products SET title_en = 'The Complete DigZoom Products Collection', description_en = '5000+ premium digital products with resell rights license', long_description_en = '5000+ premium digital products with resell rights license. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'القائمة - كل المنتجات digzoom موسوعة';

UPDATE products SET title_en = 'The DigZoom Collection', description_en = '500+ digital products with complete files', long_description_en = '500+ digital products with complete files including PDF, video, and audio content with full resell rights license.' WHERE title = 'القائمة digzoom موسوعة';

UPDATE products SET title_en = 'The Complete E-Commerce Encyclopedia', description_en = 'Comprehensive guide to e-commerce from beginner to pro', long_description_en = 'Comprehensive guide to e-commerce from beginner to pro. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'موسوعة التجارة الإلكترونية الشاملة';

UPDATE products SET title_en = 'Creative Design Library', description_en = '1000+ fonts and vectors for professional design', long_description_en = '1000+ fonts and vectors for professional design. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'مكتبة التصاميم الإبداعية';

UPDATE products SET title_en = 'Digital Marketing Video Pack', description_en = '80+ ready-to-use marketing videos for social media and ads', long_description_en = '80+ ready-to-use marketing videos for social media and ads. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'فيديوهات التسويق الرقمي';

UPDATE products SET title_en = 'Cinematic Wedding Video Templates', description_en = '20+ professional wedding video templates', long_description_en = '20+ professional wedding video templates. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'قوالب فيديو الزفاف السينمائي';

UPDATE products SET title_en = 'Educational Podcast Library', description_en = '40+ podcast episodes on self-development and business', long_description_en = '40+ podcast episodes on self-development and business. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'مكتبة البودكاست التعليمي';

UPDATE products SET title_en = 'Yoga & Meditation 4K Videos', description_en = '30+ yoga and meditation videos in 4K quality', long_description_en = '30+ yoga and meditation videos in 4K quality. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'فيديوهات اليوجا والتأمل 4K';

UPDATE products SET title_en = 'Gaming Sound Effects Pack', description_en = '500+ sound effects for electronic games', long_description_en = '500+ sound effects for electronic games. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'مؤثرات صوتية للألعاب الإلكترونية';

UPDATE products SET title_en = 'Digital Marketing Guide 2025', description_en = 'Latest digital marketing strategies with real case studies', long_description_en = 'Latest digital marketing strategies with real case studies. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل التسويق الرقمي 2025';

UPDATE products SET title_en = 'Ready-to-Use Business Plans', description_en = '25+ professional business plans for various industries with financial models', long_description_en = '25+ professional business plans for various industries with financial models. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'خطة أعمال جاهزة للتخصيص';

UPDATE products SET title_en = 'Copywriting Mastery Guide', description_en = 'Learn the art of writing copy that sells', long_description_en = 'Learn the art of writing copy that sells. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل الكتابة الإعلانية';

UPDATE products SET title_en = 'World Cuisine Cookbook', description_en = '100+ recipes from world cuisines with step-by-step photos', long_description_en = '100+ recipes from world cuisines with step-by-step photos. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'كتب الطبخ العالمية';

UPDATE products SET title_en = 'Home Fitness Guide', description_en = 'Complete home workout program with instructional videos', long_description_en = 'Complete home workout program with instructional videos. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل اللياقة البدنية المنزلي';

UPDATE products SET title_en = 'Arabic Audiobook Library', description_en = '30+ Arabic audiobooks in self-development and literature', long_description_en = '30+ Arabic audiobooks in self-development and literature. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'مكتبة الكتب الصوتية العربية';

UPDATE products SET title_en = 'Real Estate Investment Guide', description_en = 'Comprehensive guide to real estate investment for beginners', long_description_en = 'Comprehensive guide to real estate investment for beginners. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل الاستثمار العقاري';

UPDATE products SET title_en = 'Interactive Children Stories', description_en = '50+ interactive colorful stories for children of different ages', long_description_en = '50+ interactive colorful stories for children of different ages. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'قصص الأطفال التفاعلية';

UPDATE products SET title_en = 'Time Management & Productivity', description_en = 'Practical techniques for time management and 10x productivity', long_description_en = 'Practical techniques for time management and 10x productivity. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل إدارة الوقت والإنتاجية';

UPDATE products SET title_en = 'Programming Encyclopedia for Beginners', description_en = 'Learn programming from scratch with Python and JavaScript', long_description_en = 'Learn programming from scratch with Python and JavaScript. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'موسوعة البرمجة للمبتدئين';

UPDATE products SET title_en = 'Professional Photography Guide', description_en = 'Learn the art of professional photography from A to Z', long_description_en = 'Learn the art of professional photography from A to Z. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل التصوير الفوتوغرافي';

UPDATE products SET title_en = 'Graphic Design Books', description_en = '5 professional books in graphic design and branding', long_description_en = '5 professional books in graphic design and branding. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'كتب التصميم الجرافيكي';

UPDATE products SET title_en = 'International Trade Guide', description_en = 'Steps to legally import and export products', long_description_en = 'Steps to legally import and export products. Includes all necessary files with complete user guide and premium technical support.' WHERE title = 'دليل التجارة الدولية';

-- Verify: Show products with their English titles
SELECT id, title_ar, title_en, description_en FROM products WHERE title_en IS NOT NULL LIMIT 10;
