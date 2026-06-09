-- ============================================
-- SAFE: Fill title_en for ALL remaining products
-- Uses a single CASE statement with proper WHERE clause
-- ============================================

-- First: see what's still missing
SELECT COUNT(*) as still_missing FROM products WHERE title_en IS NULL OR title_en = '';

-- ============================================
-- Method: CTE with keyword matching
-- Only updates products that still have no title_en
-- ============================================

WITH keyword_mapping AS (
  SELECT id, title, category_id,
    CASE
      -- Exact product names from migration 002
      WHEN title = 'القائمة - كل المنتجات digzoom موسوعة' THEN 'The Complete DigZoom Products Collection'
      WHEN title = 'القائمة digzoom موسوعة' THEN 'The DigZoom Collection'
      WHEN title = 'موسوعة التجارة الإلكترونية الشاملة' THEN 'The Complete E-Commerce Encyclopedia'
      WHEN title = 'مكتبة التصاميم الإبداعية' THEN 'Creative Design Library'
      WHEN title = 'فيديوهات التسويق الرقمي' THEN 'Digital Marketing Video Pack'
      WHEN title = 'قوالب فيديو الزفاف السينمائي' THEN 'Cinematic Wedding Video Templates'
      WHEN title = 'مكتبة البودكاست التعليمي' THEN 'Educational Podcast Library'
      WHEN title = 'فيديوهات اليوجا والتأمل 4K' THEN 'Yoga & Meditation 4K Videos'
      WHEN title = 'مؤثرات صوتية للألعاب الإلكترونية' THEN 'Gaming Sound Effects Pack'
      WHEN title = 'دليل التسويق الرقمي 2025' THEN 'Digital Marketing Guide 2025'
      WHEN title = 'خطة أعمال جاهزة للتخصيص' THEN 'Ready-to-Use Business Plans'
      WHEN title = 'دليل الكتابة الإعلانية' THEN 'Copywriting Mastery Guide'
      WHEN title = 'كتب الطبخ العالمية' THEN 'World Cuisine Cookbook'
      WHEN title = 'دليل اللياقة البدنية المنزلي' THEN 'Home Fitness Guide'
      WHEN title = 'مكتبة الكتب الصوتية العربية' THEN 'Arabic Audiobook Library'
      WHEN title = 'دليل الاستثمار العقاري' THEN 'Real Estate Investment Guide'
      WHEN title = 'قصص الأطفال التفاعلية' THEN 'Interactive Children Stories'
      WHEN title = 'دليل إدارة الوقت والإنتاجية' THEN 'Time Management & Productivity'
      WHEN title = 'موسوعة البرمجة للمبتدئين' THEN 'Programming Encyclopedia for Beginners'
      WHEN title = 'دليل التصوير الفوتوغرافي' THEN 'Professional Photography Guide'
      WHEN title = 'كتب التصميم الجرافيكي' THEN 'Graphic Design Books'
      WHEN title = 'دليل التجارة الدولية' THEN 'International Trade Guide'
      
      -- Keyword-based matching
      WHEN title ILIKE '%تصميم%' OR title ILIKE '%design%' THEN 'Creative Design Collection'
      WHEN title ILIKE '%تسويق%' OR title ILIKE '%marketing%' THEN 'Digital Marketing Toolkit'
      WHEN title ILIKE '%فيديو%' OR title ILIKE '%موشن%' OR title ILIKE '%video%' THEN 'Video Production Pack'
      WHEN title ILIKE '%صوت%' OR title ILIKE '%مؤثرات%' OR title ILIKE '%audio%' THEN 'Professional Audio Library'
      WHEN title ILIKE '%صورة%' OR title ILIKE '%فوتو%' OR title ILIKE '%photo%' THEN 'Photography & Visual Guide'
      WHEN title ILIKE '%دورة%' OR title ILIKE '%كورس%' OR title ILIKE '%course%' THEN 'Professional Training Course'
      WHEN title ILIKE '%تجارة%' OR title ILIKE '%متجر%' OR title ILIKE '%ecommerce%' OR title ILIKE '%shop%' THEN 'E-Commerce Business Toolkit'
      WHEN title ILIKE '%سوشيال%' OR title ILIKE '%انستغرام%' OR title ILIKE '%فيسبوك%' OR title ILIKE '%تيك توك%' OR title ILIKE '%social%' OR title ILIKE '%instagram%' OR title ILIKE '%facebook%' THEN 'Social Media Growth Pack'
      WHEN title ILIKE '%يوتيوب%' OR title ILIKE '%youtube%' THEN 'YouTube Channel Growth Guide'
      WHEN title ILIKE '%بودكاست%' OR title ILIKE '%podcast%' THEN 'Podcast Creation & Monetization'
      WHEN title ILIKE '%كتابة%' OR title ILIKE '%محتوى%' OR title ILIKE '%writing%' OR title ILIKE '%content%' THEN 'Content Creation Mastery'
      WHEN title ILIKE '%برمجة%' OR title ILIKE '%برمج%' OR title ILIKE '%programming%' OR title ILIKE '%coding%' THEN 'Programming & Development Toolkit'
      WHEN title ILIKE '%مالية%' OR title ILIKE '%استثمار%' OR title ILIKE '%finance%' OR title ILIKE '%invest%' THEN 'Finance & Investment Guide'
      WHEN title ILIKE '%أعمال%' OR title ILIKE '%خطة%' OR title ILIKE '%business%' OR title ILIKE '%plan%' THEN 'Business Strategy Guide'
      WHEN title ILIKE '%قيادة%' OR title ILIKE '%إدارة%' OR title ILIKE '%leadership%' OR title ILIKE '%management%' THEN 'Leadership & Management'
      WHEN title ILIKE '%صحة%' OR title ILIKE '%لياقة%' OR title ILIKE '%health%' OR title ILIKE '%fitness%' THEN 'Health & Fitness Guide'
      WHEN title ILIKE '%طعام%' OR title ILIKE '%طبخ%' OR title ILIKE '%food%' OR title ILIKE '%cook%' THEN 'Cooking & Recipe Collection'
      WHEN title ILIKE '%سفر%' OR title ILIKE '%سياحة%' OR title ILIKE '%travel%' OR title ILIKE '%tour%' THEN 'Travel & Tourism Guide'
      WHEN title ILIKE '%أطفال%' OR title ILIKE '%أسرة%' OR title ILIKE '%children%' OR title ILIKE '%family%' THEN 'Family & Parenting Guide'
      WHEN title ILIKE '%فن%' OR title ILIKE '%رسم%' OR title ILIKE '%art%' OR title ILIKE '%draw%' THEN 'Art & Drawing Tutorial'
      WHEN title ILIKE '%موسيقى%' OR title ILIKE '%أغاني%' OR title ILIKE '%music%' THEN 'Music Production Guide'
      WHEN title ILIKE '%لعبة%' OR title ILIKE '%ألعاب%' OR title ILIKE '%game%' THEN 'Game Development Assets'
      WHEN title ILIKE '%كريبتو%' OR title ILIKE '%عملات رقمية%' OR title ILIKE '%crypto%' OR title ILIKE '%blockchain%' THEN 'Cryptocurrency & Blockchain Guide'
      WHEN title ILIKE '%ذكاء اصطناعي%' OR title ILIKE '%AI%' OR title ILIKE '%machine learning%' THEN 'AI & Machine Learning Toolkit'
      WHEN title ILIKE '%موقع%' OR title ILIKE '%ويب%' OR title ILIKE '%web%' OR title ILIKE '%site%' THEN 'Web Development & Design'
      WHEN title ILIKE '%موبايل%' OR title ILIKE '%تطبيق%' OR title ILIKE '%mobile%' OR title ILIKE '%app%' THEN 'Mobile App Development'
      WHEN title ILIKE '%SEO%' OR title ILIKE '%محركات بحث%' THEN 'SEO Optimization Guide'
      WHEN title ILIKE '%إعلانات%' OR title ILIKE '%ads%' OR title ILIKE '%advertising%' THEN 'Advertising Campaign Guide'
      WHEN title ILIKE '%بريد%' OR title ILIKE '%إيميل%' OR title ILIKE '%email%' THEN 'Email Marketing Toolkit'
      WHEN title ILIKE '%تحليل%' OR title ILIKE '%analytics%' OR title ILIKE '%data%' THEN 'Data Analytics Guide'
      WHEN title ILIKE '%مبيعات%' OR title ILIKE '%sales%' OR title ILIKE '%funnel%' THEN 'Sales Funnel & Conversion'
      WHEN title ILIKE '%علامة%' OR title ILIKE '%براند%' OR title ILIKE '%brand%' THEN 'Brand Identity Design'
      WHEN title ILIKE '%خط%' OR title ILIKE '%font%' OR title ILIKE '%typography%' THEN 'Fonts & Typography Collection'
      WHEN title ILIKE '%شعار%' OR title ILIKE '%لوجو%' OR title ILIKE '%logo%' THEN 'Logo Design Templates'
      WHEN title ILIKE '%قالب%' OR title ILIKE '%template%' THEN 'Professional Templates Pack'
      WHEN title ILIKE '%3D%' OR title ILIKE '%ثلاثي%' THEN '3D Modeling & Design'
      WHEN title ILIKE '%موشن%' OR title ILIKE '%motion%' THEN 'Motion Graphics Pack'
      WHEN title ILIKE '%انفلونسر%' OR title ILIKE '%مؤثر%' OR title ILIKE '%influencer%' THEN 'Influencer Marketing Guide'
      WHEN title ILIKE '%أفلييت%' OR title ILIKE '%affiliate%' THEN 'Affiliate Marketing Toolkit'
      WHEN title ILIKE '%دروب%' OR title ILIKE '%dropship%' THEN 'Dropshipping Business Guide'
      WHEN title ILIKE '%ستارت%' OR title ILIKE '%startup%' OR title ILIKE '%entrepreneur%' THEN 'Startup & Entrepreneurship'
      WHEN title ILIKE '%فريلانس%' OR title ILIKE '%freelance%' THEN 'Freelancing Success Guide'
      WHEN title ILIKE '%دورة%' OR title ILIKE '%تدريب%' OR title ILIKE '%course%' OR title ILIKE '%training%' THEN 'Professional Training Course'
      WHEN title ILIKE '%ووردبريس%' OR title ILIKE '%wordpress%' THEN 'WordPress Development Guide'
      WHEN title ILIKE '%شوبيفاي%' OR title ILIKE '%shopify%' THEN 'Shopify Store Setup'
      WHEN title ILIKE '%أمان%' OR title ILIKE '%حماية%' OR title ILIKE '%security%' THEN 'Cybersecurity Essentials'
      WHEN title ILIKE '%سحابة%' OR title ILIKE '%cloud%' THEN 'Cloud Computing Guide'
      WHEN title ILIKE '%اجتماعي%' OR title ILIKE '%social%' THEN 'Social Media Strategy'
      
      -- Default fallback
      ELSE 'Premium Digital Product'
    END as generated_title
  FROM products
  WHERE title_en IS NULL OR title_en = ''
)
UPDATE products 
SET title_en = keyword_mapping.generated_title,
    description_en = CASE 
      WHEN keyword_mapping.generated_title = 'Premium Digital Product' THEN 'High-quality digital resource for professionals'
      ELSE 'Professional digital product with premium quality and complete files'
    END,
    long_description_en = CASE 
      WHEN keyword_mapping.generated_title = 'Premium Digital Product' THEN 'High-quality digital resource for professionals. Includes all necessary files with complete user guide and premium support.'
      ELSE 'Professional digital product with premium quality and complete files. Includes all necessary files with user guide and premium technical support.'
    END
FROM keyword_mapping
WHERE products.id = keyword_mapping.id
  AND (products.title_en IS NULL OR products.title_en = '');

-- ============================================
-- Verify
-- ============================================
SELECT 
  COUNT(*) as total_products,
  COUNT(title_en) as with_english,
  COUNT(*) - COUNT(title_en) as missing_english
FROM products;

-- Show sample of updated products
SELECT id, title, title_en FROM products LIMIT 10;
