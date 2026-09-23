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
  includedDescriptionsAr?: string[];
  includedDescriptionsEn?: string[];
  clientAr: string[];
  clientEn: string[];
  digzoomAr: string[];
  digzoomEn: string[];
  limitsAr: string[];
  limitsEn: string[];
};

export const servicePlans: ServicePlan[] = [
  {
    id: "website-stability",
    nameAr: "استقرار الموقع",
    nameEn: "Website Stability",
    price: 1490,
    summaryAr:
      "موقعك تحت المتابعة: نرصد الأعطال، نحدّث عروضك ومعلوماتك، ونجهز منتجين كل شهر.",
    summaryEn:
      "We monitor your site, refresh key offers and details, and prepare two listings each month.",
    resultAr:
      "موقع مرتب ومعلومات حديثة، مع تنبيه سريع إذا ظهر عطل بدل اكتشافه من العميل.",
    resultEn:
      "A stable website without updates and incidents draining your team.",
    bestForAr:
      "مناسبة لمن لديه موقع قائم ويريد متابعة الأعطال وتحديث الأسعار والعروض والمعلومات المهمة كل شهر.",
    bestForEn:
      "Best for an existing website that needs ongoing care and small updates, without social media management.",
    productsAr: "يشمل تجهيز منتجين شهريًا",
    productsEn: "Includes 2 product listings monthly",
    countingAr: [
      "كل تحديث من الأربعة يخص عنصرًا واحدًا في صفحة قائمة، مثل سعر أو صورة أو نص أو عرض؛ وتحدد التحديثات في خطة الشهر.",
      "صفحة المنتج تشمل إدخال البيانات والصور التي يزودنا بها العميل وتنسيقها للنشر.",
      "إنشاء صفحة جديدة أو تغيير التصميم أو إضافة برمجة لا يُحسب كتحديث محتوى ويُسعّر منفصلًا.",
    ],
    countingEn: [
      "Each of the four updates changes one item on an existing page, such as a price, image, line of copy, or offer, agreed in the monthly plan.",
      "A product listing uses client-supplied information and images and formats them for publishing.",
      "New pages, redesigns, and development are outside content updates and quoted separately.",
    ],
    includedAr: [
      "مراقبة عمل الموقع والتنبيه عند وجود عطل",
      "نسخ احتياطي وفحص أمني أساسي",
      "إبقاء أسعارك وعروضك ومعلومات موقعك محدثة",
      "تحديث النظام والإضافات المتوافقة",
      "تجهيز صفحتي منتج من بيانات وصور العميل",
      "تقرير شهري واستجابة خلال يوم عمل",
    ],
    includedEn: [
      "Uptime monitoring and incident alerts",
      "Backups and basic security review",
      "Keep key prices, offers, and website details current",
      "Compatible core and plugin updates",
      "2 product pages using client-supplied assets",
      "Monthly report and 1-business-day response",
    ],
    includedDescriptionsAr: [
      "نراقب توفر الموقع وننبهك عند رصد عطل حتى يمكن التعامل معه بسرعة.",
      "نراجع وجود النسخ الاحتياطية والإعدادات الأمنية الأساسية للموقع.",
      "نحدّث سعرًا أو صورة أو عرضًا أو نصًا مهمًا في صفحة قائمة، حتى 4 عناصر متفق عليها خلال الشهر.",
      "نراجع تحديثات نظام الموقع والإضافات المتوافقة ونطبق المناسب منها.",
      "نرتب بيانات وصور منتجين تزودنا بها ونجهز صفحتيهما للنشر بعد اعتمادك.",
      "نرسل ملخصًا بما نُفذ وما يحتاج انتباهًا، ونرد خلال يوم عمل على طلبات الباقة.",
    ],
    includedDescriptionsEn: [
      "We monitor site availability and alert you when an issue is detected.",
      "We review backups and basic website security settings.",
      "We update one price, image, offer, or key text item on an existing page, up to 4 agreed items per month.",
      "We review core and compatible plugin updates and apply appropriate ones.",
      "We use your product data and images to prepare two approved listings for publishing.",
      "We summarize completed work and issues to review, and reply to plan requests within one business day.",
    ],
    clientAr: [
      "توفير صلاحية الموقع والاستضافة",
      "إرسال المحتوى والصور المعتمدة",
      "اعتماد التعديلات خلال يومي عمل",
    ],
    clientEn: [
      "Provide website and hosting access",
      "Supply approved copy and images",
      "Approve changes within 2 business days",
    ],
    digzoomAr: [
      "تنفيذ الأعمال المتفق عليها",
      "حماية بيانات الدخول",
      "إبلاغك بالأعطال والمخاطر المهمة",
      "تقرير واضح بما تم",
    ],
    digzoomEn: [
      "Deliver agreed work",
      "Protect access credentials",
      "Report material incidents and risks",
      "Provide a clear work report",
    ],
    limitsAr: [
      "لا يشمل إعادة تصميم الموقع",
      "لا يشمل البرمجة الجديدة أو الاستضافة",
      "حصة المنتجات لا تتراكم",
      "الأعمال الإضافية تُسعّر قبل التنفيذ",
    ],
    limitsEn: [
      "No website redesign",
      "No new development or hosting",
      "Product capacity does not roll over",
      "Extra work is quoted before execution",
    ],
  },
  {
    id: "social-presence",
    nameAr: "حضور اجتماعي",
    nameEn: "Social Presence",
    price: 2990,
    summaryAr:
      "حساباتك نشطة بمحتوى مفهوم: 12 منشورًا و12 قصة تُنشر على منصتين تختارهما.",
    summaryEn:
      "Keep two selected channels active with 12 posts and 12 stories each month.",
    resultAr:
      "حسابان يظهران بمحتوى منتظم يشرح خدماتك ويعرض منتجاتك ويحفز التواصل معك.",
    resultEn: "A professional, consistent presence instead of random posting.",
    bestForAr:
      "مناسبة للمنشأة التي لديها موقع أو متجر جاهز وتحتاج حضورًا منتظمًا على منصتين، دون إدارة الموقع.",
    bestForEn:
      "Best for a business with an existing website or store that needs consistent content on two platforms, without website management.",
    productsAr: "إضافة المنتجات غير مشمولة",
    productsEn: "Product listing is not included",
    countingAr: [
      "12 منشورًا تعني 12 تصميمًا أصليًا خلال الشهر تشمل عروض منتجات أو خدمات، معلومات مفيدة، أسئلة تفاعلية، ومحتوى ثقة حسب نشاطك، مع النص والتعليق المصاحب.",
      "12 قصة تعني 12 تصميمًا عموديًا مستقلًا للعروض والمنتجات والأسئلة والكواليس.",
      "تُنشر المواد نفسها على المنصتين بعد تهيئة المقاس والنص؛ العدد ليس 12 منشورًا لكل منصة.",
      "لا تشمل الباقة تصويرًا ميدانيًا أو مقاطع فيديو أو حملات إعلانية مدفوعة.",
    ],
    countingEn: [
      "12 posts means 12 unique feed designs during the month, including copy and captions.",
      "12 stories means 12 unique vertical story designs.",
      "The same assets are adapted and published across both platforms; it is not 12 posts per platform.",
      "On-location production, video content, and paid campaigns are not included.",
    ],
    includedAr: [
      "إدارة منصتين يختارهما العميل",
      "خطة شهرية تحدد الموضوع وموعد النشر",
      "12 منشورًا مصممًا مع كتابة النصوص",
      "12 قصة مصممة بالمقاس العمودي",
      "تهيئة المواد وجدولتها ونشرها على المنصتين",
      "متابعة التعليقات والتنبيه للاستفسارات المهمة",
      "تقرير أداء شهري وتوصيات للشهر التالي",
    ],
    includedEn: [
      "Management of 2 selected platforms",
      "Monthly topics and publishing calendar",
      "12 designed posts with copywriting",
      "12 designed vertical stories",
      "Adaptation, scheduling, and publishing on both platforms",
      "Comment monitoring and alerts for important inquiries",
      "Monthly report and next-month recommendations",
    ],
    includedDescriptionsAr: [
      "تختار حسابين مثل Instagram أو TikTok أو X أو LinkedIn، وننسق المحتوى الملائم لهما.",
      "نحدد موضوع كل مادة، هدفها، والمنصة وموعد النشر قبل بدء الشهر.",
      "نجهز صورًا وتصاميم لمنتجاتك وخدماتك، ومعلومات مفيدة وأسئلة ومحتوى يبني الثقة، مع النصوص المصاحبة.",
      "نصمم قصصًا عمودية للعروض والمنتجات والكواليس والأسئلة والتفاعل مع الجمهور.",
      "نضبط المقاس والنص المناسبين لكل حساب، ثم ننشر المواد المعتمدة حسب الجدول.",
      "نراجع التعليقات الظاهرة ونبلغك بالاستفسارات التي تحتاج ردًا متخصصًا منك.",
      "نلخص ما نُشر والتفاعل المتاح، ونقترح ما يمكن تحسينه في الشهر التالي.",
    ],
    includedDescriptionsEn: [
      "Choose two accounts, such as Instagram, TikTok, X, or LinkedIn. We adapt suitable content for both.",
      "We agree each asset's topic, purpose, platform, and publishing date before the month begins.",
      "We design posts for products, services, useful tips, audience questions, and trust-building, with captions.",
      "We design vertical stories for offers, products, behind-the-scenes content, and audience interaction.",
      "We adapt size and copy for each account and publish approved assets to schedule.",
      "We check visible comments and alert you to inquiries requiring your specialist response.",
      "We summarize published work and available engagement, with suggestions for the next month.",
    ],
    clientAr: [
      "توفير صلاحيات الحسابات",
      "تقديم معلومات العروض والمنتجات مبكرًا",
      "اعتماد خطة المحتوى خلال يومي عمل",
      "الرد على الاستفسارات المتخصصة",
    ],
    clientEn: [
      "Provide account access",
      "Share offers and product details early",
      "Approve the content plan within 2 business days",
      "Answer specialist customer questions",
    ],
    digzoomAr: [
      "إعداد الخطة والكتابة والتصميم",
      "جدولة المحتوى بعد الاعتماد",
      "مراقبة الأداء والتوصية بالتحسين",
      "الحفاظ على أسلوب العلامة",
    ],
    digzoomEn: [
      "Plan, write, and design content",
      "Schedule after approval",
      "Monitor performance and recommend improvements",
      "Maintain brand consistency",
    ],
    limitsAr: [
      "لا يشمل التصوير الميداني",
      "لا يشمل ميزانية الإعلان",
      "جولتان من التعديلات",
      "خدمة العملاء الكاملة غير مشمولة",
    ],
    limitsEn: [
      "No on-location photography",
      "Ad spend is excluded",
      "Two revision rounds",
      "Full customer support is excluded",
    ],
  },
  {
    id: "growth-system",
    nameAr: "إدارة موقعك وتسويقك بالكامل",
    nameEn: "Website & Marketing Management",
    price: 4990,
    summaryAr:
      "ندير موقعك، محتواك، منصات التواصل، المنتجات والإعلانات في باقة شهرية واحدة.",
    summaryEn:
      "One monthly plan for your website, content, social media, product listings, and advertising.",
    resultAr:
      "موقع محدث، ومحتوى منشور بانتظام، وإعلانات نتابع نتائجها، وتقرير واضح بما تم كل شهر.",
    resultEn:
      "An up-to-date website, regularly published content, monitored advertising, and a clear monthly work report.",
    bestForAr:
      "مناسبة لصاحب متجر أو منشأة يريد فريقًا واحدًا يتولى الموقع والتسويق، مع مهام وأعداد واضحة كل شهر.",
    bestForEn:
      "For store and business owners who want one team to handle their website and marketing, with clear monthly tasks and quantities.",
    productsAr: "إضافة وتجهيز حتى 20 منتجًا أو خدمة شهريًا",
    productsEn: "Add and prepare up to 20 products or services monthly",
    countingAr: [
      "16 منشورًا تعني 16 مادة أصلية للحساب: عروض منتجات وخدمات، نصائح وشروحات، أسئلة للتفاعل، ومحتوى لبناء الثقة من أعمال وآراء عملاء موثقة. نحدد المزيج حسب نشاطك.",
      "16 قصة تعني 16 تصميمًا عموديًا للعروض والمنتجات والكواليس والأسئلة، وتُحسب منفصلة عن المنشورات.",
      "الأعداد إجمالية للباقة، وليست لكل منصة. نهيئ المواد للنشر على المنصات الثلاث بما يناسب كل منصة.",
      "4 فيديوهات قصيرة تعني مونتاج مقاطع Reels أو Shorts من صور وفيديوهات يرسلها العميل، مع نصوص وانتقالات مناسبة.",
      "حتى 20 منتجًا أو خدمة تعني تجهيز صفحة لكل منتج أو خدمة: الاسم والوصف والصور والسعر والمواصفات والتصنيف، ثم الإضافة إلى الموقع بعد الاعتماد.",
      "الحملة الإعلانية الواحدة تُدار على Google أو منصة تواصل واحدة نتفق عليها. ميزانية عرض الإعلان تُدفع للمنصة بصورة منفصلة.",
      "تحديثات الموقع تخص الصفحات الحالية. نحدد التعديلات في خطة الشهر؛ التطوير البرمجي وإعادة التصميم والمنتجات الإضافية تُسعّر منفصلًا قبل التنفيذ.",
    ],
    countingEn: [
      "16 posts means 16 original feed assets: product or service offers, tips and explanations, audience questions, and trust-building content based on documented work and customer feedback. The mix follows your business.",
      "16 stories means 16 vertical designs for offers, products, behind-the-scenes content, and questions, counted separately from feed posts.",
      "Quantities are totals for the plan, not per platform. Assets are adapted for the three selected platforms.",
      "4 short videos means editing Reels or Shorts from client-supplied photos and footage, with suitable text and transitions.",
      "Up to 20 products or services means preparing a page for each: name, description, images, price, specifications, and category, then adding it to the website after approval.",
      "One campaign is managed on Google or one agreed social advertising platform. Advertising spend is paid to the platform separately.",
      "Website updates cover existing pages and are agreed in the monthly plan. Development, redesigns, and extra listings are quoted separately before work begins.",
    ],
    includedAr: [
      "إدارة وتحديث الموقع",
      "إدارة 3 منصات تواصل اجتماعي",
      "تصميم ونشر 16 منشورًا شهريًا",
      "تصميم ونشر 16 قصة شهريًا",
      "مونتاج 4 فيديوهات قصيرة شهريًا",
      "إضافة وتجهيز حتى 20 منتجًا أو خدمة شهريًا",
      "كتابة المحتوى وجدولته ونشره",
      "تحديث الأسعار والعروض والصفحات الحالية",
      "إدارة حملة إعلانية واحدة شهريًا",
      "ربط الموقع بأداة قياس الزيارات والطلبات",
      "تحسين أساسي لظهور صفحات الموقع في Google",
      "تقرير شهري واضح عن النتائج",
      "اجتماع متابعة شهري",
      "3 اقتراحات عملية لتحسين المبيعات كل شهر",
    ],
    includedEn: [
      "Website management and updates",
      "Management of 3 social media platforms",
      "Design and publish 16 posts monthly",
      "Design and publish 16 stories monthly",
      "Edit 4 short videos monthly",
      "Add and prepare up to 20 products or services monthly",
      "Write, schedule, and publish content",
      "Update prices, offers, and existing pages",
      "Manage one advertising campaign monthly",
      "Set up website visit and order tracking",
      "Basic improvements for Google search visibility",
      "A clear monthly results report",
      "A monthly review meeting",
      "3 practical sales improvement suggestions monthly",
    ],
    includedDescriptionsAr: [
      "نتابع الموقع وننفذ تحديثات المحتوى المتفق عليها، مع فحص الروابط والنماذج وتجربة الجوال شهريًا.",
      "تختار 3 حسابات مثل Instagram أو TikTok أو X أو LinkedIn أو Facebook، وننسق المحتوى المناسب لها.",
      "صور وتصاميم تظهر في حسابك لعرض المنتجات والخدمات، وشرح فوائدها، وتقديم نصائح وأسئلة ومحتوى يبني الثقة.",
      "تصاميم عمودية تظهر في قسم القصص لعرض المنتجات والعروض والكواليس والأسئلة والتفاعل مع الجمهور.",
      "نحول الصور والفيديوهات التي ترسلها إلى مقاطع Reels أو Shorts، مع كتابة النصوص وإضافة الانتقالات المناسبة.",
      "نجهز الاسم والوصف والصور والسعر والمواصفات والتصنيف، ونضيف صفحة كل منتج أو خدمة إلى موقعك بعد اعتمادها.",
      "نكتب العناوين والنصوص المصاحبة، ونرتب جدول الشهر، ثم ننشر المواد بعد موافقتك.",
      "نعدل النصوص والصور والأسعار والعروض في صفحات موقعك الحالية حسب خطة العمل المتفق عليها.",
      "نجهز حملة على Google أو منصة تواصل واحدة، ونتابعها ونحسنها. ميزانية الإعلان المدفوعة للمنصة غير مشمولة.",
      "نربط أداة مثل Google Analytics ونضبط تتبع الزيارات والطلبات والنقرات المتاحة، لتعرف من أين يأتي العملاء.",
      "نحسن عناوين وأوصاف الصفحات التي نعمل عليها ليسهل فهمها في البحث. هذا مختلف عن الإعلان المدفوع ولا يضمن المركز الأول.",
      "نوضح ما نفذناه والزيارات والتفاعل والطلبات التي أمكن قياسها، وأفضل المحتوى وما يحتاج إلى تحسين.",
      "نراجع معك التقرير والأولويات، ونتفق على خطة الشهر التالي.",
      "نقدم 3 خطوات محددة تناسب نشاطك، مثل توضيح عرض، تحسين صفحة منتج، أو تسهيل التواصل والشراء.",
    ],
    includedDescriptionsEn: [
      "We maintain agreed website content and check links, forms, and the mobile experience each month.",
      "Choose 3 accounts, such as Instagram, TikTok, X, LinkedIn, or Facebook. We adapt suitable content for them.",
      "Feed images and designs that present products and services, explain benefits, share tips, ask questions, and build trust.",
      "Vertical designs in the Stories section for products, offers, behind-the-scenes content, and audience interaction.",
      "We turn your photos and footage into Reels or Shorts with suitable copy and transitions.",
      "We prepare the name, description, images, price, specifications, and category, then add each approved listing to your website.",
      "We write headlines and captions, prepare the monthly calendar, and publish after your approval.",
      "We update copy, images, prices, and offers on existing website pages within the agreed monthly plan.",
      "We set up, monitor, and improve one campaign on Google or one social platform. Advertising spend paid to the platform is excluded.",
      "We connect a tool such as Google Analytics and configure available visit, order, and click tracking to show where customers come from.",
      "We improve titles and descriptions on the pages we work on. This is separate from paid advertising and does not guarantee a number-one ranking.",
      "We explain work completed, measurable visits, engagement and orders, best-performing content, and areas to improve.",
      "We review your report and priorities together and agree the next month’s plan.",
      "We suggest 3 specific steps for your business, such as clarifying an offer, improving a product page, or making contact and checkout easier.",
    ],
    clientAr: [
      "توفير صلاحيات الموقع والحسابات والمواد اللازمة للعمل.",
      "إرسال معلومات صحيحة عن المنتجات والأسعار والعروض، وصور وفيديوهات لديك حق استخدامها.",
      "تحديد شخص واحد لاعتماد المحتوى والملاحظات خلال يومي عمل.",
      "توفير الحساب الإعلاني وميزانية الإعلان المتفق عليها قبل إطلاق الحملة.",
    ],
    clientEn: [
      "Provide website and account access and the assets needed for the work.",
      "Supply accurate product, price, and offer details, with images and footage you have rights to use.",
      "Assign one contact to approve content and feedback within 2 business days.",
      "Provide the advertising account and agreed ad budget before campaign launch.",
    ],
    digzoomAr: [
      "إعداد خطة شهرية توضح الأعمال والأعداد ومواعيد النشر.",
      "إرسال المحتوى للمراجعة وتنفيذ التعديلات المتفق عليها قبل النشر.",
      "متابعة الموقع والمحتوى والحملة وقياس النتائج المتاحة.",
      "تسليم تقرير واجتماع متابعة و3 اقتراحات عملية كل شهر.",
    ],
    digzoomEn: [
      "Prepare a monthly plan showing tasks, quantities, and publishing dates.",
      "Send content for review and apply agreed changes before publishing.",
      "Monitor the website, content, and campaign, using available performance data.",
      "Deliver a monthly report, review meeting, and 3 practical suggestions.",
    ],
    limitsAr: [
      "ميزانية الإعلانات المدفوعة غير مشمولة في سعر الباقة وتُدفع للمنصة منفصلة.",
      "التصوير الميداني واشتراكات المنصات والخدمات الخارجية غير مشمولة.",
      "لا نضمن رقم مبيعات محددًا أو المركز الأول في Google.",
      "الحصص شهرية ولا تتراكم؛ المنتجات والأعمال الإضافية تُسعّر وتُعتمد قبل التنفيذ.",
      "إعادة تصميم الموقع أو التطوير البرمجي الكبير لا يدخلان ضمن تحديثات الصفحات الحالية.",
    ],
    limitsEn: [
      "Paid advertising spend is excluded from the plan and paid to the platform separately.",
      "On-location production, platform subscriptions, and external services are excluded.",
      "No specific sales figure or number-one Google ranking is guaranteed.",
      "Monthly quantities do not roll over; extra listings and work are quoted and approved in advance.",
      "Website redesigns and major development are outside existing-page updates.",
    ],
  },
  {
    id: "digital-scale",
    nameAr: "إدارة موسعة",
    nameEn: "Expanded Management",
    price: 7990,
    summaryAr:
      "موقعك و3 منصات بمحتوى أكثر، حتى 25 منتجًا، مع حملة إعلانية وصفحة عرض مخصصة شهريًا.",
    summaryEn:
      "More content for your website and 3 channels, up to 25 listings, plus one campaign and one landing page monthly.",
    resultAr:
      "محتوى وعروض أكثر، مع صفحة تجمع طلبات العملاء وحملة تقودهم إليها، وتقارير واجتماعين للمتابعة.",
    resultEn:
      "Higher monthly execution for a business with ready offers, ad budget, and a fast approver.",
    bestForAr:
      "مناسبة للمنشأة التي لديها عروض جاهزة وميزانية إعلانية وتحتاج تنفيذًا مكثفًا عبر الموقع وثلاث منصات.",
    bestForEn:
      "Best for a business with ready offers and ad budget that needs higher-volume execution across its website and three platforms.",
    productsAr: "يشمل تجهيز حتى 25 منتجًا أو خدمة شهريًا",
    productsEn: "Includes up to 25 product or service listings monthly",
    countingAr: [
      "20 منشورًا و20 قصة هي مواد إجمالية تُهيّأ للمنصات الثلاث، وليست 20 لكل منصة.",
      "المقاطع الأربعة تشمل المونتاج من مواد يقدمها العميل؛ التصوير والإنتاج الميداني منفصلان.",
      "يشمل الشهر إدارة حملة إعلانية واحدة وصفحة عرض واحدة على الموقع لشرح العرض وجمع الطلبات، عند توفر المواد والصلاحيات اللازمة.",
      "ميزانية الإعلان تُدفع للمنصة مباشرة ولا تدخل في سعر الباقة.",
    ],
    countingEn: [
      "20 posts and 20 stories are total assets adapted across three platforms, not 20 per platform.",
      "The 4 short videos are edited from client-supplied assets; filming and production are separate.",
      "Each month includes one managed campaign and one on-site landing page for the offer and inquiries, when the required assets and access are provided.",
      "Ad spend is paid directly to the platform and is not included in the plan price.",
    ],
    includedAr: [
      "إدارة الموقع و3 منصات يختارها العميل",
      "20 منشورًا مصممًا و20 قصة مصممة",
      "كتابة المحتوى والجدولة والنشر",
      "مونتاج 4 مقاطع قصيرة من مواد العميل",
      "إضافة وتجهيز حتى 25 منتجًا أو خدمة شهريًا",
      "صفحة عرض مخصصة وإدارة حملة إعلانية واحدة شهريًا",
      "اجتماعان شهريًا ودعم بأولوية",
    ],
    includedEn: [
      "Website and 3 selected platforms",
      "20 designed posts and 20 designed stories",
      "Copywriting, scheduling, and publishing",
      "Editing 4 short videos from client assets",
      "Add and prepare up to 25 products or services monthly",
      "One offer landing page and one managed campaign monthly",
      "2 monthly calls and priority support",
    ],
    includedDescriptionsAr: [
      "نحدّث صفحات موقعك الحالية وندير 3 حسابات تختارها، بخطة موحدة للمحتوى والعروض.",
      "نجهز 20 تصميمًا للحساب و20 قصة عمودية للعروض والمعلومات والتفاعل، بأعداد إجمالية للمنصات الثلاث.",
      "نكتب العناوين والنصوص المصاحبة ونرتب موعد النشر، ثم ننشر المواد بعد اعتمادها.",
      "نحوّل صورك ومقاطعك إلى 4 فيديوهات قصيرة للنشر؛ التصوير الميداني منفصل.",
      "نجهز الاسم والوصف والصور والسعر والتصنيف والمواصفات، ونضيف حتى 25 صفحة منتج أو خدمة بعد اعتمادها.",
      "نجهز صفحة على موقعك تشرح العرض وتتيح التواصل أو الطلب، وندير حملة واحدة تقود العملاء إلى العرض. ميزانية الإعلان منفصلة.",
      "نجتمع مرتين لمراجعة التنفيذ والنتائج، ونعطي طلباتك أولوية في المتابعة خلال ساعات العمل.",
    ],
    includedDescriptionsEn: [
      "We update existing website pages and manage 3 selected accounts using one content and offer plan.",
      "We prepare 20 feed designs and 20 vertical stories for offers, information, and engagement, counted across all three platforms.",
      "We write headlines and captions, schedule content, and publish after approval.",
      "We edit 4 short videos from your photos and footage; on-location filming is separate.",
      "We prepare name, copy, images, price, category, and details, then add up to 25 approved listings.",
      "We build one page on your site explaining the offer and collecting inquiries, and manage one campaign driving traffic to it. Ad spend is separate.",
      "We meet twice to review work and results, and prioritize plan requests during business hours.",
    ],
    clientAr: [
      "توفير الصلاحيات والميزانية الإعلانية",
      "توفير المواد والعروض في موعدها",
      "مسؤول اعتماد سريع",
      "الالتزام بصحة الأسعار والمخزون",
    ],
    clientEn: [
      "Provide access and ad budget",
      "Supply materials and offers on time",
      "Assign a fast approver",
      "Maintain accurate prices and inventory",
    ],
    digzoomAr: [
      "إدارة خطة التنفيذ الموسعة",
      "النشر والتحسين والمتابعة",
      "إدارة أساسية للحملات",
      "تقارير واجتماعات منتظمة",
    ],
    digzoomEn: [
      "Manage expanded execution",
      "Publish, optimize, and monitor",
      "Basic campaign management",
      "Regular reporting and calls",
    ],
    limitsAr: [
      "الميزانية الإعلانية منفصلة",
      "الإنتاج والتصوير الاحترافي بتسعير مستقل",
      "التطوير البرمجي الكبير غير مشمول",
      "الطلبات خارج النطاق تحتاج عرضًا منفصلًا",
    ],
    limitsEn: [
      "Ad spend is separate",
      "Professional production is quoted separately",
      "Major development excluded",
      "Out-of-scope requests need a separate quote",
    ],
  },
];

export const getServicePlan = (id?: string) =>
  servicePlans.find(plan => plan.id === id);
