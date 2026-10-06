// Existing catalog rows store Arabic feature arrays. Keep those rows unchanged
// while supporting localized arrays when they become available in the catalog.
const FEATURE_EN: Record<string, string> = {
  'ثنائي اللغة AR + EN': 'Bilingual AR + EN',
  'قابل للتعديل': 'Editable',
  'تعليمات استخدام': 'Usage instructions',
  '90 صفاً للتخطيط': '90 planning rows',
  'لوحة مؤشرات تفاعلية': 'Interactive dashboard',
  'بيانات تجريبية واقعية': 'Realistic sample data',
  'معادلات وحسابات تلقائية': 'Automatic formulas and calculations',
  'حساب ROI تلقائي': 'Automatic ROI calculation',
  'مقارنة المخطط والفعلي': 'Planned vs. actual comparison',
  'CTR و CPC و CPA': 'CTR, CPC and CPA',
  'حساب ROAS': 'ROAS calculation',
  'مؤشرات تلقائية': 'Automatic metrics',
  'معدل التفاعل': 'Engagement rate',
  'نمو المتابعين': 'Follower growth',
  'قوائم اختيار': 'Dropdown lists',
  'مراحل البيع': 'Sales stages',
  'متابعة المواعيد': 'Appointment tracking',
  'قابل للتخصيص': 'Customizable',
  'مهام وأولويات': 'Tasks and priorities',
  'حالة التنفيذ': 'Implementation status',
  'قائمة إطلاق عملية': 'Practical launch checklist',
  'صافي الربح': 'Net profit',
  'هامش الربح': 'Profit margin',
  'اختبار الخصومات': 'Discount testing',
  'تكلفة النتيجة': 'Cost per result',
  'عائد الحملة': 'Campaign return',
  'إدارة المؤثرين': 'Influencer management',
  'خطة 12 شهراً': '12-month plan',
  'الميزانية والنتائج': 'Budget and results',
  'متابعة الانحراف': 'Variance tracking',
  'شرائح العملاء': 'Customer segments',
  'المشكلات والدوافع': 'Pain points and motivations',
  'رسائل تسويقية': 'Marketing messages',
};

type FeatureSource = {
  features?: unknown;
  features_ar?: unknown;
  features_en?: unknown;
};

function stringFeatures(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((feature): feature is string => typeof feature === 'string' && feature.trim().length > 0)
    : [];
}

export function productFeatures(product: FeatureSource, lang: string): string[] {
  const localized = stringFeatures(lang === 'en' ? product.features_en : product.features_ar);
  if (localized.length > 0) return localized;

  const features = stringFeatures(product.features);
  // Preserve unknown content rather than inventing or dropping product claims.
  return lang === 'en' ? features.map(feature => Object.hasOwn(FEATURE_EN, feature.trim()) ? FEATURE_EN[feature.trim()] : feature) : features;
}
