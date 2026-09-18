export type ServicePlan = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  summaryAr: string;
  summaryEn: string;
  resultAr: string;
  resultEn: string;
  productsAr: string;
  productsEn: string;
  includedAr: string[];
  includedEn: string[];
  clientAr: string[];
  clientEn: string[];
  digzoomAr: string[];
  digzoomEn: string[];
  limitsAr: string[];
  limitsEn: string[];
};

export const servicePlans: ServicePlan[] = [
  {
    id: 'website-stability', nameAr: 'استقرار الموقع', nameEn: 'Website Stability', price: 1490,
    summaryAr: 'إدارة تشغيلية تحافظ على موقعك محدثًا وآمنًا وواضحًا.', summaryEn: 'Operational care that keeps your website current, secure, and clear.',
    resultAr: 'موقع يعمل باستقرار دون أن تستهلك التحديثات والأعطال وقت فريقك.', resultEn: 'A stable website without updates and incidents draining your team.',
    productsAr: 'يشمل تجهيز منتجين شهريًا', productsEn: 'Includes 2 product listings monthly',
    includedAr: ['مراقبة الموقع والأعطال', 'نسخ احتياطي وفحص أمني', '4 تحديثات محتوى شهريًا', 'تحديث النظام والإضافات', 'تجهيز منتجين شهريًا', 'تقرير شهري واستجابة خلال يوم عمل'],
    includedEn: ['Website and incident monitoring', 'Backups and security review', '4 content updates monthly', 'Core and plugin updates', '2 product listings monthly', 'Monthly report and 1-business-day response'],
    clientAr: ['توفير صلاحية الموقع والاستضافة', 'إرسال المحتوى والصور المعتمدة', 'اعتماد التعديلات خلال يومي عمل'], clientEn: ['Provide website and hosting access', 'Supply approved copy and images', 'Approve changes within 2 business days'],
    digzoomAr: ['تنفيذ الأعمال المتفق عليها', 'حماية بيانات الدخول', 'إبلاغك بالأعطال والمخاطر المهمة', 'تقرير واضح بما تم'], digzoomEn: ['Deliver agreed work', 'Protect access credentials', 'Report material incidents and risks', 'Provide a clear work report'],
    limitsAr: ['لا يشمل إعادة تصميم الموقع', 'لا يشمل البرمجة الجديدة أو الاستضافة', 'حصة المنتجات لا تتراكم', 'الأعمال الإضافية تُسعّر قبل التنفيذ'], limitsEn: ['No website redesign', 'No new development or hosting', 'Product capacity does not roll over', 'Extra work is quoted before execution'],
  },
  {
    id: 'social-presence', nameAr: 'حضور اجتماعي', nameEn: 'Social Presence', price: 2990,
    summaryAr: 'محتوى منظم يحافظ على حضور علامتك عبر منصتين.', summaryEn: 'Structured content that keeps your brand active across two platforms.',
    resultAr: 'حضور احترافي منتظم بدل النشر المتقطع والقرارات اليومية العشوائية.', resultEn: 'A professional, consistent presence instead of random posting.',
    productsAr: 'إضافة المنتجات غير مشمولة', productsEn: 'Product listing is not included',
    includedAr: ['إدارة منصتين', 'خطة محتوى شهرية', '12 منشورًا مصممًا', '12 قصة', 'الكتابة والجدولة والنشر', 'متابعة أساسية للتفاعل', 'تقرير أداء شهري'], includedEn: ['2 platforms', 'Monthly content plan', '12 designed posts', '12 stories', 'Copy, scheduling, and publishing', 'Basic engagement monitoring', 'Monthly performance report'],
    clientAr: ['توفير صلاحيات الحسابات', 'تقديم معلومات العروض والمنتجات مبكرًا', 'اعتماد خطة المحتوى خلال يومي عمل', 'الرد على الاستفسارات المتخصصة'], clientEn: ['Provide account access', 'Share offers and product details early', 'Approve the content plan within 2 business days', 'Answer specialist customer questions'],
    digzoomAr: ['إعداد الخطة والكتابة والتصميم', 'جدولة المحتوى بعد الاعتماد', 'مراقبة الأداء والتوصية بالتحسين', 'الحفاظ على أسلوب العلامة'], digzoomEn: ['Plan, write, and design content', 'Schedule after approval', 'Monitor performance and recommend improvements', 'Maintain brand consistency'],
    limitsAr: ['لا يشمل التصوير الميداني', 'لا يشمل ميزانية الإعلان', 'جولتان من التعديلات', 'خدمة العملاء الكاملة غير مشمولة'], limitsEn: ['No on-location photography', 'Ad spend is excluded', 'Two revision rounds', 'Full customer support is excluded'],
  },
  {
    id: 'growth-system', nameAr: 'نظام النمو', nameEn: 'Growth System', price: 4990,
    summaryAr: 'الموقع والمحتوى والقياس يعملون ضمن خطة شهرية واحدة.', summaryEn: 'Website, content, and measurement working through one monthly plan.',
    resultAr: 'حضور رقمي متماسك تعرف فيه ما نُفذ وما الذي تغير وما الخطوة التالية.', resultEn: 'A connected digital presence where execution and next steps are visible.',
    productsAr: 'يشمل تجهيز 5 منتجات شهريًا', productsEn: 'Includes 5 product listings monthly',
    includedAr: ['إدارة الموقع ومنصتين', '12 منشورًا و12 قصة', 'مقطعان قصيران شهريًا', '5 صفحات منتجات', 'تحديث العروض والصفحات', 'إعداد قياس التحويلات', 'اجتماع وتقرير شهري'], includedEn: ['Website and 2 platforms', '12 posts and 12 stories', '2 short videos monthly', '5 product pages', 'Offer and page updates', 'Conversion tracking setup', 'Monthly call and report'],
    clientAr: ['توفير الصلاحيات والمواد الأساسية', 'تحديد مسؤول اعتماد واحد', 'اعتماد الخطة خلال يومي عمل', 'توفير معلومات المنتجات الصحيحة'], clientEn: ['Provide access and core assets', 'Assign one approver', 'Approve the plan within 2 business days', 'Provide accurate product information'],
    digzoomAr: ['خطة تنفيذ موحدة', 'النشر والتحديث وفق الجدول', 'ربط الأداء بالأهداف', 'توضيح الأعمال والنتائج دون أرقام مصطنعة'], digzoomEn: ['One execution plan', 'Publish and update to schedule', 'Connect performance to goals', 'Report work honestly without invented metrics'],
    limitsAr: ['ميزانية الإعلان منفصلة', 'لا ضمان لرقم مبيعات محدد', 'التصوير الميداني غير مشمول', 'حصة المنتجات لا تتراكم'], limitsEn: ['Ad spend is separate', 'No guaranteed sales figure', 'On-location photography excluded', 'Product capacity does not roll over'],
  },
  {
    id: 'digital-scale', nameAr: 'توسع رقمي', nameEn: 'Digital Scale', price: 7990,
    summaryAr: 'تنفيذ أوسع للمنشآت الجاهزة للتوسع المنظم.', summaryEn: 'Broader execution for businesses ready to scale with control.',
    resultAr: 'وتيرة نشر وحملات وصفحات أعلى مع متابعة أقرب وقرارات أسرع.', resultEn: 'Higher execution volume with closer review and faster decisions.',
    productsAr: 'يشمل تجهيز 10 منتجات شهريًا', productsEn: 'Includes 10 product listings monthly',
    includedAr: ['إدارة الموقع و3 منصات', '20 منشورًا و20 قصة', '4 مقاطع قصيرة', '10 صفحات منتجات', 'صفحة هبوط أو حملة شهرية', 'إدارة إعلانية أساسية', 'اجتماعان ودعم أولوية'], includedEn: ['Website and 3 platforms', '20 posts and 20 stories', '4 short videos', '10 product pages', 'One landing page or campaign monthly', 'Basic ad management', '2 calls and priority support'],
    clientAr: ['توفير الصلاحيات والميزانية الإعلانية', 'توفير المواد والعروض في موعدها', 'مسؤول اعتماد سريع', 'الالتزام بصحة الأسعار والمخزون'], clientEn: ['Provide access and ad budget', 'Supply materials and offers on time', 'Assign a fast approver', 'Maintain accurate prices and inventory'],
    digzoomAr: ['إدارة خطة التنفيذ الموسعة', 'النشر والتحسين والمتابعة', 'إدارة أساسية للحملات', 'تقارير واجتماعات منتظمة'], digzoomEn: ['Manage expanded execution', 'Publish, optimize, and monitor', 'Basic campaign management', 'Regular reporting and calls'],
    limitsAr: ['الميزانية الإعلانية منفصلة', 'الإنتاج والتصوير الاحترافي بتسعير مستقل', 'التطوير البرمجي الكبير غير مشمول', 'الطلبات خارج النطاق تحتاج عرضًا منفصلًا'], limitsEn: ['Ad spend is separate', 'Professional production is quoted separately', 'Major development excluded', 'Out-of-scope requests need a separate quote'],
  },
];

export const getServicePlan = (id?: string) => servicePlans.find(plan => plan.id === id);
