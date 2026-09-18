export type ServicePlan = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  summaryAr: string;
  summaryEn: string;
  resultAr: string;
  resultEn: string;
  bestForAr: string;
  bestForEn: string;
  productsAr: string;
  productsEn: string;
  countingAr: string[];
  countingEn: string[];
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
    bestForAr: 'مناسبة لمن لديه موقع قائم ويحتاج صيانة مستمرة وتعديلات بسيطة، دون إدارة منصات التواصل.', bestForEn: 'Best for an existing website that needs ongoing care and small updates, without social media management.',
    productsAr: 'يشمل تجهيز منتجين شهريًا', productsEn: 'Includes 2 product listings monthly',
    countingAr: ['التحديث الواحد تعديل بسيط في صفحة قائمة، مثل تغيير نص أو صورة أو سعر أو عرض.', 'صفحة المنتج تشمل إدخال البيانات والصور التي يزودنا بها العميل وتنسيقها للنشر.', 'إنشاء صفحة جديدة أو تغيير التصميم أو إضافة برمجة لا يُحسب كتحديث محتوى ويُسعّر منفصلًا.'],
    countingEn: ['One update is a small change to an existing page, such as copy, image, price, or offer.', 'A product listing uses client-supplied information and images and formats them for publishing.', 'New pages, redesigns, and development are outside content updates and quoted separately.'],
    includedAr: ['مراقبة عمل الموقع والتنبيه عند وجود عطل', 'نسخ احتياطي وفحص أمني أساسي', '4 تعديلات محتوى بسيطة شهريًا', 'تحديث النظام والإضافات المتوافقة', 'تجهيز صفحتي منتج من بيانات وصور العميل', 'تقرير شهري واستجابة خلال يوم عمل'],
    includedEn: ['Uptime monitoring and incident alerts', 'Backups and basic security review', '4 small content updates monthly', 'Compatible core and plugin updates', '2 product pages using client-supplied assets', 'Monthly report and 1-business-day response'],
    clientAr: ['توفير صلاحية الموقع والاستضافة', 'إرسال المحتوى والصور المعتمدة', 'اعتماد التعديلات خلال يومي عمل'], clientEn: ['Provide website and hosting access', 'Supply approved copy and images', 'Approve changes within 2 business days'],
    digzoomAr: ['تنفيذ الأعمال المتفق عليها', 'حماية بيانات الدخول', 'إبلاغك بالأعطال والمخاطر المهمة', 'تقرير واضح بما تم'], digzoomEn: ['Deliver agreed work', 'Protect access credentials', 'Report material incidents and risks', 'Provide a clear work report'],
    limitsAr: ['لا يشمل إعادة تصميم الموقع', 'لا يشمل البرمجة الجديدة أو الاستضافة', 'حصة المنتجات لا تتراكم', 'الأعمال الإضافية تُسعّر قبل التنفيذ'], limitsEn: ['No website redesign', 'No new development or hosting', 'Product capacity does not roll over', 'Extra work is quoted before execution'],
  },
  {
    id: 'social-presence', nameAr: 'حضور اجتماعي', nameEn: 'Social Presence', price: 2990,
    summaryAr: 'محتوى منظم يحافظ على حضور علامتك عبر منصتين.', summaryEn: 'Structured content that keeps your brand active across two platforms.',
    resultAr: 'حضور احترافي منتظم بدل النشر المتقطع والقرارات اليومية العشوائية.', resultEn: 'A professional, consistent presence instead of random posting.',
    bestForAr: 'مناسبة للمنشأة التي لديها موقع أو متجر جاهز وتحتاج حضورًا منتظمًا على منصتين، دون إدارة الموقع.', bestForEn: 'Best for a business with an existing website or store that needs consistent content on two platforms, without website management.',
    productsAr: 'إضافة المنتجات غير مشمولة', productsEn: 'Product listing is not included',
    countingAr: ['12 منشورًا تعني 12 تصميمًا مستقلًا خلال الشهر، مع كتابة النص والتعليق المصاحب.', '12 قصة تعني 12 تصميمًا عموديًا مستقلًا للقصص.', 'تُنشر المواد نفسها على المنصتين بعد تهيئة المقاس والنص؛ العدد ليس 12 منشورًا لكل منصة.', 'لا تشمل الباقة تصويرًا ميدانيًا أو مقاطع فيديو أو حملات إعلانية مدفوعة.'],
    countingEn: ['12 posts means 12 unique feed designs during the month, including copy and captions.', '12 stories means 12 unique vertical story designs.', 'The same assets are adapted and published across both platforms; it is not 12 posts per platform.', 'On-location production, video content, and paid campaigns are not included.'],
    includedAr: ['إدارة منصتين يختارهما العميل', 'خطة شهرية تحدد الموضوع وموعد النشر', '12 منشورًا مصممًا مع كتابة النصوص', '12 قصة مصممة بالمقاس العمودي', 'تهيئة المواد وجدولتها ونشرها على المنصتين', 'متابعة التعليقات والتنبيه للاستفسارات المهمة', 'تقرير أداء شهري وتوصيات للشهر التالي'], includedEn: ['Management of 2 selected platforms', 'Monthly topics and publishing calendar', '12 designed posts with copywriting', '12 designed vertical stories', 'Adaptation, scheduling, and publishing on both platforms', 'Comment monitoring and alerts for important inquiries', 'Monthly report and next-month recommendations'],
    clientAr: ['توفير صلاحيات الحسابات', 'تقديم معلومات العروض والمنتجات مبكرًا', 'اعتماد خطة المحتوى خلال يومي عمل', 'الرد على الاستفسارات المتخصصة'], clientEn: ['Provide account access', 'Share offers and product details early', 'Approve the content plan within 2 business days', 'Answer specialist customer questions'],
    digzoomAr: ['إعداد الخطة والكتابة والتصميم', 'جدولة المحتوى بعد الاعتماد', 'مراقبة الأداء والتوصية بالتحسين', 'الحفاظ على أسلوب العلامة'], digzoomEn: ['Plan, write, and design content', 'Schedule after approval', 'Monitor performance and recommend improvements', 'Maintain brand consistency'],
    limitsAr: ['لا يشمل التصوير الميداني', 'لا يشمل ميزانية الإعلان', 'جولتان من التعديلات', 'خدمة العملاء الكاملة غير مشمولة'], limitsEn: ['No on-location photography', 'Ad spend is excluded', 'Two revision rounds', 'Full customer support is excluded'],
  },
  {
    id: 'growth-system', nameAr: 'نظام النمو', nameEn: 'Growth System', price: 4990,
    summaryAr: 'الموقع والمحتوى والقياس يعملون ضمن خطة شهرية واحدة.', summaryEn: 'Website, content, and measurement working through one monthly plan.',
    resultAr: 'حضور رقمي متماسك تعرف فيه ما نُفذ وما الذي تغير وما الخطوة التالية.', resultEn: 'A connected digital presence where execution and next steps are visible.',
    bestForAr: 'مناسبة لمن يريد إدارة الموقع ومنصتين والمحتوى والمنتجات والقياس مع فريق واحد.', bestForEn: 'Best for a business that wants one team to manage its website, two platforms, content, products, and measurement.',
    productsAr: 'يشمل تجهيز 5 منتجات شهريًا', productsEn: 'Includes 5 product listings monthly',
    countingAr: ['12 منشورًا و12 قصة هي مواد إجمالية تُهيّأ وتُنشر على المنصتين، وليست لكل منصة.', 'المقطعان القصيران يشملان المونتاج من صور أو مقاطع يقدمها العميل؛ التصوير الميداني غير مشمول.', 'صفحات المنتجات الخمس تشمل تنسيق البيانات والصور وكتابة وصف أساسي جاهز للنشر.', 'تحديثات الموقع تخص الصفحات القائمة؛ إعادة التصميم أو البرمجة الكبيرة تُسعّر منفصلًا.'],
    countingEn: ['12 posts and 12 stories are total assets adapted and published across both platforms, not per platform.', 'The 2 short videos are edited from client-supplied footage or images; filming is excluded.', 'The 5 product pages include data and image formatting plus basic publish-ready copy.', 'Website updates apply to existing pages; redesigns and major development are quoted separately.'],
    includedAr: ['إدارة الموقع ومنصتين يختارهما العميل', '12 منشورًا مصممًا و12 قصة مصممة', 'كتابة المحتوى والجدولة والنشر', 'مونتاج مقطعين قصيرين من مواد العميل', 'تجهيز 5 صفحات منتجات جاهزة للنشر', 'تحديث العروض والمحتوى في الصفحات القائمة', 'إعداد قياس التحويلات واجتماع وتقرير شهري'], includedEn: ['Website and 2 selected platforms', '12 designed posts and 12 designed stories', 'Copywriting, scheduling, and publishing', 'Editing 2 short videos from client assets', '5 publish-ready product pages', 'Offer and content updates on existing pages', 'Conversion tracking, monthly call, and report'],
    clientAr: ['توفير الصلاحيات والمواد الأساسية', 'تحديد مسؤول اعتماد واحد', 'اعتماد الخطة خلال يومي عمل', 'توفير معلومات المنتجات الصحيحة'], clientEn: ['Provide access and core assets', 'Assign one approver', 'Approve the plan within 2 business days', 'Provide accurate product information'],
    digzoomAr: ['خطة تنفيذ موحدة', 'النشر والتحديث وفق الجدول', 'ربط الأداء بالأهداف', 'توضيح الأعمال والنتائج دون أرقام مصطنعة'], digzoomEn: ['One execution plan', 'Publish and update to schedule', 'Connect performance to goals', 'Report work honestly without invented metrics'],
    limitsAr: ['ميزانية الإعلان منفصلة', 'لا ضمان لرقم مبيعات محدد', 'التصوير الميداني غير مشمول', 'حصة المنتجات لا تتراكم'], limitsEn: ['Ad spend is separate', 'No guaranteed sales figure', 'On-location photography excluded', 'Product capacity does not roll over'],
  },
  {
    id: 'digital-scale', nameAr: 'توسع رقمي', nameEn: 'Digital Scale', price: 7990,
    summaryAr: 'تنفيذ أوسع للمنشآت الجاهزة للتوسع المنظم.', summaryEn: 'Broader execution for businesses ready to scale with control.',
    resultAr: 'وتيرة نشر وحملات وصفحات أعلى مع متابعة أقرب وقرارات أسرع.', resultEn: 'Higher execution volume with closer review and faster decisions.',
    bestForAr: 'مناسبة للمنشأة التي لديها عروض جاهزة وميزانية إعلانية وتحتاج تنفيذًا مكثفًا عبر الموقع وثلاث منصات.', bestForEn: 'Best for a business with ready offers and ad budget that needs higher-volume execution across its website and three platforms.',
    productsAr: 'يشمل تجهيز 10 منتجات شهريًا', productsEn: 'Includes 10 product listings monthly',
    countingAr: ['20 منشورًا و20 قصة هي مواد إجمالية تُهيّأ للمنصات الثلاث، وليست 20 لكل منصة.', 'المقاطع الأربعة تشمل المونتاج من مواد يقدمها العميل؛ التصوير والإنتاج الميداني منفصلان.', 'يشمل الشهر صفحة هبوط واحدة أو إدارة حملة إعلانية واحدة، وليس الاثنين معًا.', 'ميزانية الإعلان تُدفع للمنصة مباشرة ولا تدخل في سعر الباقة.'],
    countingEn: ['20 posts and 20 stories are total assets adapted across three platforms, not 20 per platform.', 'The 4 short videos are edited from client-supplied assets; filming and production are separate.', 'Each month includes either one landing page or management of one campaign, not both.', 'Ad spend is paid directly to the platform and is not included in the plan price.'],
    includedAr: ['إدارة الموقع و3 منصات يختارها العميل', '20 منشورًا مصممًا و20 قصة مصممة', 'كتابة المحتوى والجدولة والنشر', 'مونتاج 4 مقاطع قصيرة من مواد العميل', 'تجهيز 10 صفحات منتجات جاهزة للنشر', 'صفحة هبوط واحدة أو إدارة حملة شهرية واحدة', 'اجتماعان شهريًا ودعم بأولوية'], includedEn: ['Website and 3 selected platforms', '20 designed posts and 20 designed stories', 'Copywriting, scheduling, and publishing', 'Editing 4 short videos from client assets', '10 publish-ready product pages', 'One landing page or one managed campaign monthly', '2 monthly calls and priority support'],
    clientAr: ['توفير الصلاحيات والميزانية الإعلانية', 'توفير المواد والعروض في موعدها', 'مسؤول اعتماد سريع', 'الالتزام بصحة الأسعار والمخزون'], clientEn: ['Provide access and ad budget', 'Supply materials and offers on time', 'Assign a fast approver', 'Maintain accurate prices and inventory'],
    digzoomAr: ['إدارة خطة التنفيذ الموسعة', 'النشر والتحسين والمتابعة', 'إدارة أساسية للحملات', 'تقارير واجتماعات منتظمة'], digzoomEn: ['Manage expanded execution', 'Publish, optimize, and monitor', 'Basic campaign management', 'Regular reporting and calls'],
    limitsAr: ['الميزانية الإعلانية منفصلة', 'الإنتاج والتصوير الاحترافي بتسعير مستقل', 'التطوير البرمجي الكبير غير مشمول', 'الطلبات خارج النطاق تحتاج عرضًا منفصلًا'], limitsEn: ['Ad spend is separate', 'Professional production is quoted separately', 'Major development excluded', 'Out-of-scope requests need a separate quote'],
  },
];

export const getServicePlan = (id?: string) => servicePlans.find(plan => plan.id === id);
