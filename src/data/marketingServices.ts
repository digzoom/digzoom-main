export interface MarketingService {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  price: number;
  priceUnit: string;
  priceUnitAr: string;
  duration: string;
  durationAr: string;
  features: { en: string[]; ar: string[] };
  icon: string;
  color: string;
  badge: { en: string; ar: string };
  popular: boolean;
}

export const marketingServices: MarketingService[] = [
  {
    id: 'account-management',
    titleAr: 'إدارة حسابات السوشال ميديا',
    titleEn: 'Social Media Account Management',
    descriptionAr: 'ندير حسابك بالكامل وننشر محتوى احترافي يومي',
    descriptionEn: 'We fully manage your account and post professional daily content',
    longDescriptionAr: 'فريق متخصص يدير حساباتك على جميع منصات التواصل الاجتماعي. نخطط المحتوى، نصمم، ننشر، ونتفاعل مع جمهورك يومياً. هدفنا زيادة متابعين حقيقيين وتفاعل حقيقي.',
    longDescriptionEn: 'A specialized team manages your accounts on all social media platforms. We plan content, design, publish, and engage with your audience daily. Our goal is to increase real followers and real engagement.',
    price: 500,
    priceUnit: 'SAR/month',
    priceUnitAr: 'ر.س/شهر',
    duration: 'Monthly subscription',
    durationAr: 'اشتراك شهري',
    features: {
      ar: [
        'نشر 1-2 منشور يومياً',
        'تصميم Stories يومية',
        'رد على التعليقات والرسائل',
        'تقرير أسبوعي عن الأداء',
        'استراتيجية محتوى شهري',
        'إدارة حسابين (إنستقرام + تيك توك)',
      ],
      en: [
        '1-2 posts per day',
        'Daily Stories design',
        'Reply to comments and messages',
        'Weekly performance report',
        'Monthly content strategy',
        'Manage 2 accounts (Instagram + TikTok)',
      ],
    },
    icon: 'Users',
    color: 'from-purple-600 to-blue-600',
    badge: { ar: 'متابعين حقيقيون', en: 'Real Followers' },
    popular: true,
  },
  {
    id: 'paid-ads',
    titleAr: 'إعلانات ممولة',
    titleEn: 'Paid Advertising',
    descriptionAr: 'حملات إعلانية احترافية على تيك توك وإنستقرام وسناب شات',
    descriptionEn: 'Professional ad campaigns on TikTok, Instagram, and Snapchat',
    longDescriptionAr: 'ننشئ وندير حملات إعلانية ممولة تستهدف جمهورك المثالي. نتابع الأداء ونحسن الإعلانات يومياً لتحقيق أفضل نتيجة بأقل تكلفة.',
    longDescriptionEn: 'We create and manage sponsored ad campaigns targeting your ideal audience. We monitor performance and optimize ads daily to achieve the best results at the lowest cost.',
    price: 300,
    priceUnit: 'SAR/campaign',
    priceUnitAr: 'ر.س/حملة',
    duration: 'Per campaign + budget',
    durationAr: 'لكل حملة + ميزانية',
    features: {
      ar: [
        'دراسة جمهور مستهدف',
        'تصميم 3-5 إعلانات',
        'إدارة الميزانية يومياً',
        'تحسين الأداء (A/B Testing)',
        'تقرير مفصل بالنتائج',
        'استشارات مجانية',
      ],
      en: [
        'Target audience research',
        '3-5 ad designs',
        'Daily budget management',
        'Performance optimization (A/B Testing)',
        'Detailed results report',
        'Free consultation',
      ],
    },
    icon: 'TrendingUp',
    color: 'from-orange-500 to-red-600',
    badge: { ar: 'استهداف حقيقي', en: 'Real Targeting' },
    popular: true,
  },
  {
    id: 'content-creation',
    titleAr: 'تصميم المحتوى',
    titleEn: 'Content Creation',
    descriptionAr: 'فيديوهات احترافية + تصاميم جرافيكية + كتابة نصوص',
    descriptionEn: 'Professional videos + graphic designs + copywriting',
    longDescriptionAr: 'فريق إبداعي متخصص في صناعة المحتوى. نسوي فيديوهات ريلز وتايك توك، تصاميم بوستات، ونكتب نصوص جذابة بلهجتك.',
    longDescriptionEn: 'A creative team specialized in content creation. We make Reels and TikTok videos, post designs, and write engaging copy in your dialect.',
    price: 200,
    priceUnit: 'SAR/package',
    priceUnitAr: 'ر.س/باقة',
    duration: 'Per package',
    durationAr: 'لكل باقة',
    features: {
      ar: [
        '10 فيديوهات ريلز/تيك توك',
        '15 تصميم بوست',
        '10 Stories متحركة',
        'كتابة نصوص تفاعلية',
        'هاشتاقات مخصصة',
        'تعديلات مجانية',
      ],
      en: [
        '10 Reels/TikTok videos',
        '15 post designs',
        '10 animated Stories',
        'Engaging copywriting',
        'Custom hashtags',
        'Free revisions',
      ],
    },
    icon: 'Palette',
    color: 'from-pink-500 to-rose-600',
    badge: { ar: 'محتوى أصلي', en: 'Original Content' },
    popular: false,
  },
  {
    id: 'consultation',
    titleAr: 'استشارات تسويقية',
    titleEn: 'Marketing Consultation',
    descriptionAr: 'خطة تسويقية كاملة واستراتيجية محتوى مخصصة',
    descriptionEn: 'Complete marketing plan and custom content strategy',
    longDescriptionAr: 'جلسة استشارية مع خبير تسويق لتحليل حسابك ووضع خطة تسويقية مخصصة. تشمل دراسة منافسين، تحليل جمهور، وخطة محتوى لشهر كامل.',
    longDescriptionEn: 'A consultation session with a marketing expert to analyze your account and create a custom marketing plan. Includes competitor study, audience analysis, and a full-month content plan.',
    price: 150,
    priceUnit: 'SAR/session',
    priceUnitAr: 'ر.س/جلسة',
    duration: 'One-time',
    durationAr: 'مرة واحدة',
    features: {
      ar: [
        'تحليل كامل للحساب',
        'دراسة 3 منافسين',
        'خطة محتوى لشهر كامل',
        'نصائح لزيادة التفاعل',
        'تقرير PDF مفصل',
        'متابعة بعد الجلسة',
      ],
      en: [
        'Full account analysis',
        'Study 3 competitors',
        'Full-month content plan',
        'Engagement growth tips',
        'Detailed PDF report',
        'Post-session follow-up',
      ],
    },
    icon: 'Lightbulb',
    color: 'from-yellow-500 to-amber-600',
    badge: { ar: 'خطة مخصصة', en: 'Custom Plan' },
    popular: false,
  },
  {
    id: 'product-photography',
    titleAr: 'تصوير منتجات احترافي',
    titleEn: 'Professional Product Photography',
    descriptionAr: 'صور احترافية لمنتجاتك على خلفية بيضاء أو سينمائية',
    descriptionEn: 'Professional photos of your products on white or cinematic background',
    longDescriptionAr: 'فريق تصوير محترف يلتقط صور فاخرة لمنتجاتك. نصور في الاستوديو مع إضاءة احترافية، ونحرر الصور لتكون جاهزة للمتجر.',
    longDescriptionEn: 'A professional photography team captures luxury photos of your products. We shoot in-studio with professional lighting and edit photos to be store-ready.',
    price: 250,
    priceUnit: 'SAR/session',
    priceUnitAr: 'ر.س/جلسة',
    duration: 'Per session',
    durationAr: 'لكل جلسة',
    features: {
      ar: [
        '20 صورة احترافية',
        'إضاءة استوديو متكاملة',
        'تعديل وتلوين احترافي',
        'خلفية بيضاء أو سينمائية',
        'تسليم خلال 3 أيام',
        'صيغة JPG عالية الجودة',
      ],
      en: [
        '20 professional photos',
        'Full studio lighting',
        'Professional color grading',
        'White or cinematic background',
        'Delivery within 3 days',
        'High-quality JPG format',
      ],
    },
    icon: 'Camera',
    color: 'from-cyan-500 to-blue-600',
    badge: { ar: 'جودة عالية', en: 'High Quality' },
    popular: false,
  },
];
