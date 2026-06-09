/**
 * Fallback lookup for local products (src/data/products.ts)
 * that don't have title_en fields. Maps Arabic title → English.
 */
const LOCAL_PRODUCT_EN: Record<string, string> = {
  'القائمة - كل المنتجات digzoom موسوعة': 'The Complete DigZoom Products Collection',
  'القائمة digzoom موسوعة': 'The DigZoom Collection',
  'موسوعة التجارة الإلكترونية الشاملة': 'The Complete E-Commerce Encyclopedia',
  'مكتبة التصاميم الإبداعية': 'Creative Design Library',
  'فيديوهات التسويق الرقمي': 'Digital Marketing Video Pack',
  'قوالب فيديو الزفاف السينمائي': 'Cinematic Wedding Video Templates',
  'مكتبة البودكاست التعليمي': 'Educational Podcast Library',
  'فيديوهات اليوجا والتأمل 4K': 'Yoga & Meditation 4K Videos',
  'مؤثرات صوتية للألعاب الإلكترونية': 'Gaming Sound Effects Pack',
  'دليل التسويق الرقمي 2025': 'Digital Marketing Guide 2025',
  'خطة أعمال جاهزة للتخصيص': 'Ready-to-Use Business Plans',
  'دليل الكتابة الإعلانية': 'Copywriting Mastery Guide',
  'كتب الطبخ العالمية': 'World Cuisine Cookbook',
  'دليل اللياقة البدنية المنزلي': 'Home Fitness Guide',
  'مكتبة الكتب الصوتية العربية': 'Arabic Audiobook Library',
  'دليل الاستثمار العقاري': 'Real Estate Investment Guide',
  'قصص الأطفال التفاعلية': 'Interactive Children Stories',
  'دليل إدارة الوقت والإنتاجية': 'Time Management & Productivity',
  'موسوعة البرمجة للمبتدئين': 'Programming Encyclopedia for Beginners',
  'دليل التصوير الفوتوغرافي': 'Professional Photography Guide',
  'كتب التصميم الجرافيكي': 'Graphic Design Books',
  'دليل التجارة الدولية': 'International Trade Guide',
  'القائمة موسوعة التصاميم الشاملة': 'Complete Design Encyclopedia',
  'مكتبة التصاميم الإبداعية 2024': 'Creative Design Library 2024',
  'دليل السوشيال ميديا الشامل': 'Complete Social Media Guide',
  'دورة التسويق الرقمي': 'Digital Marketing Course',
  'قوالب الموشن جرافيك': 'Motion Graphics Templates',
  'مؤثرات صوتية احترافية': 'Professional Sound Effects',
  'موسيقى خلفية للفيديوهات': 'Background Music for Videos',
  'دليل التجارة الإلكترونية': 'E-Commerce Guide',
  'دورة التصوير الاحترافي': 'Professional Photography Course',
  'قوالب البوربوينت': 'PowerPoint Templates',
  'دليل تحسين محركات البحث': 'SEO Guide',
  'دورة الجرافيك ديزاين': 'Graphic Design Course',
  'مكتبة الأيقونات والشعارات': 'Icons & Logos Library',
  'دليل التيك توك': 'TikTok Growth Guide',
  'مكتبة الفيكتور والرسومات': 'Vectors & Illustrations Library',
  'دورة البودكاست': 'Podcasting Course',
  'قوالب الإنستغرام': 'Instagram Templates',
  'دليل اليوتيوب': 'YouTube Growth Guide',
  'مكتبة الخطوط العربية': 'Arabic Fonts Library',
};

/**
 * Bilingual helper for products and content.
 * Returns the English version when lang='en', Arabic otherwise.
 */
export function bilingual(
  lang: string,
  ar: string | null | undefined,
  en: string | null | undefined
): string {
  if (lang === 'en' && en && en.trim().length > 0) {
    return en;
  }
  return ar || en || '';
}

/**
 * Get localized product title based on current language.
 * Checks: 1) bilingual field, 2) local fallback map, 3) original title
 */
export function productTitle(product: any, lang: string): string {
  if (lang === 'en') {
    return product.title_en || LOCAL_PRODUCT_EN[product.title] || product.title || '';
  }
  return product.title_ar || product.title || '';
}

/**
 * Fallback lookup for product descriptions.
 */
const LOCAL_DESC_EN: Record<string, string> = {
  '5000+ منتج رقمي بريميوم مع ترخيص إعادة البيع': '5000+ premium digital products with resell rights license',
  '500+ منتج رقمي بملفات كاملة': '500+ digital products with complete files',
  'كتاب شامل عن التجارة الإلكترونية من الصفر للاحتراف': 'Comprehensive guide to e-commerce from beginner to pro',
  '1000+ خط وفيكتور للتصميم الاحترافي': '1000+ fonts and vectors for professional design',
  '80+ فيديو تسويقي جاهز للسوشال ميديا والإعلانات': '80+ ready-to-use marketing videos for social media and ads',
  '20+ قالب فيديو زفاف احترافي': '20+ professional wedding video templates',
  '40+ حلقة بودكاست في التنمية الذاتية والأعمال': '40+ podcast episodes on self-development and business',
  '30+ فيديو يوجا وتأمل بجودة 4K': '30+ yoga and meditation videos in 4K quality',
  '500+ مؤثر صوتي للألعاب الإلكترونية': '500+ sound effects for electronic games',
  'أحدث استراتيجيات التسويق الرقمي مع دراسات حالة واقعية': 'Latest digital marketing strategies with real case studies',
  '25+ خطة عمل احترافية لمختلف المجالات مع نماذج مالية': '25+ professional business plans for various industries with financial models',
  'تعلم فن كتابة النصوص الإعلانية التي تبيع': 'Learn the art of writing copy that sells',
  '100+ وصفة من مطابخ العالم مع صور خطوة بخطوة': '100+ recipes from world cuisines with step-by-step photos',
  'برنامج تمارين كامل للمنزل مع فيديوهات توضيحية': 'Complete home workout program with instructional videos',
  '30+ كتاب صوتي عربي في التنمية الذاتية والأدب': '30+ Arabic audiobooks in self-development and literature',
  'دليل شامل للاستثمار في العقارات للمبتدئين': 'Comprehensive guide to real estate investment for beginners',
  '50+ قصة تفاعلية ملونة للأطفال بأعمار مختلفة': '50+ interactive colorful stories for children of different ages',
  'تقنيات عملية لإدارة الوقت وزيادة الإنتاجية 10 أضعاف': 'Practical techniques for time management and 10x productivity',
  'تعلم البرمجة من الصفر مع Python وJavaScript': 'Learn programming from scratch with Python and JavaScript',
  'تعلم فن التصوير الاحترافي من الألف إلى الياء': 'Learn the art of professional photography from A to Z',
  '5 كتب احترافية في التصميم الجرافيكي والبراندنج': '5 professional books in graphic design and branding',
  'خطوات استيراد وتصدير المنتجات بشكل قانوني': 'Steps to legally import and export products',
};

/**
 * Get localized product description based on current language.
 * Checks: 1) bilingual field, 2) local fallback map, 3) original description
 */
export function productDescription(product: any, lang: string): string {
  if (lang === 'en') {
    return product.description_en || LOCAL_DESC_EN[product.description] || product.description || '';
  }
  return product.description_ar || product.description || '';
}

/**
 * Get localized long description based on current language.
 */
export function productLongDescription(product: any, lang: string): string {
  if (lang === 'en') {
    return product.long_description_en || product.longDescription_en || product.long_description || product.longDescription || '';
  }
  return product.long_description_ar || product.longDescription_ar || product.long_description || product.longDescription || '';
}
