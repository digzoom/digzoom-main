import { describe, expect, it } from 'vitest';
import { productFeatures } from './productFeatures';

const calendarFeatures = [
  'ثنائي اللغة AR + EN', 'قابل للتعديل', 'تعليمات استخدام', '90 صفاً للتخطيط',
  'لوحة مؤشرات تفاعلية', 'بيانات تجريبية واقعية', 'معادلات وحسابات تلقائية',
];

describe('productFeatures', () => {
  it('translates all seven features of product 5 without changing Arabic content', () => {
    const product = { features: calendarFeatures };
    expect(productFeatures(product, 'en')).toEqual([
      'Bilingual AR + EN', 'Editable', 'Usage instructions', '90 planning rows',
      'Interactive dashboard', 'Realistic sample data', 'Automatic formulas and calculations',
    ]);
    expect(productFeatures(product, 'ar')).toEqual(calendarFeatures);
    expect(product.features).toEqual(calendarFeatures);
  });

  it('covers the other feature strings in the current public catalog', () => {
    const features = [
      'حساب ROI تلقائي', 'مقارنة المخطط والفعلي', 'CTR و CPC و CPA', 'حساب ROAS',
      'مؤشرات تلقائية', 'معدل التفاعل', 'نمو المتابعين', 'قوائم اختيار', 'مراحل البيع',
      'متابعة المواعيد', 'قابل للتخصيص', 'مهام وأولويات', 'حالة التنفيذ', 'قائمة إطلاق عملية',
      'صافي الربح', 'هامش الربح', 'اختبار الخصومات', 'تكلفة النتيجة', 'عائد الحملة',
      'إدارة المؤثرين', 'خطة 12 شهراً', 'الميزانية والنتائج', 'متابعة الانحراف',
      'شرائح العملاء', 'المشكلات والدوافع', 'رسائل تسويقية',
    ];
    const result = productFeatures({ features }, 'en');
    expect(result).toHaveLength(features.length);
    expect(result.join(' ')).not.toMatch(/[\u0600-\u06ff]/);
  });

  it('prefers explicit localized feature arrays', () => {
    const product = { features: calendarFeatures, features_ar: ['ميزة جديدة'], features_en: ['New feature'] };
    expect(productFeatures(product, 'en')).toEqual(['New feature']);
    expect(productFeatures(product, 'ar')).toEqual(['ميزة جديدة']);
  });

  it('ignores malformed values and preserves unknown feature claims', () => {
    expect(productFeatures({ features: null }, 'en')).toEqual([]);
    expect(productFeatures({ features: { malformed: true } }, 'en')).toEqual([]);
    expect(productFeatures({ features: [null, 42, '', ' ', 'CSV export', 'ميزة جديدة', ' قابل للتعديل '] }, 'en'))
      .toEqual(['CSV export', 'ميزة جديدة', 'Editable']);
    expect(productFeatures({ features: ['__proto__', 'constructor', 'toString'] }, 'en'))
      .toEqual(['__proto__', 'constructor', 'toString']);
  });
});
