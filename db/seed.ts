import { getDb } from "../api/queries/connection";
import { categories, products, socialServices } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed categories
  const categoriesData = [
    { slug: "ebooks", nameAr: "كتب إلكترونية", nameEn: "E-Books", icon: "BookOpen", color: "#3b82f6", productCount: 43 },
    { slug: "videos", nameAr: "فيديوهات", nameEn: "Videos", icon: "Video", color: "#ef4444", productCount: 27 },
    { slug: "templates", nameAr: "قوالب", nameEn: "Templates", icon: "Layout", color: "#8b5cf6", productCount: 25 },
    { slug: "fonts", nameAr: "خطوط", nameEn: "Fonts", icon: "Type", color: "#ec4899", productCount: 25 },
    { slug: "graphics", nameAr: "جرافيكس", nameEn: "Graphics", icon: "Palette", color: "#f59e0b", productCount: 33 },
    { slug: "3d-models", nameAr: "نماذج 3D", nameEn: "3D Models", icon: "Box", color: "#10b981", productCount: 28 },
    { slug: "photos", nameAr: "صور", nameEn: "Photos", icon: "Camera", color: "#06b6d4", productCount: 33 },
    { slug: "code", nameAr: "أكواد", nameEn: "Code", icon: "Code", color: "#f97316", productCount: 28 },
    { slug: "web-design", nameAr: "تصميم ويب", nameEn: "Web Design", icon: "Globe", color: "#6366f1", productCount: 26 },
    { slug: "audio", nameAr: "صوتيات", nameEn: "Audio", icon: "Music", color: "#14b8a6", productCount: 32 },
  ];

  for (const cat of categoriesData) {
    await db.insert(categories).values(cat).onDuplicateKeyUpdate({
      set: cat,
    });
  }
  console.log("Categories seeded!");

  // Seed sample products
  const productsData = [
    {
      slug: "cinematic-wedding-templates",
      titleAr: "قوالب فيديو الزفاف السينمائي",
      titleEn: "Cinematic Wedding Video Templates",
      descriptionAr: "مجموعة احترافية من قوالب فيديو الزفاف بجودة سينمائية",
      descriptionEn: "Professional cinematic wedding video templates collection",
      longDescriptionAr: "مجموعة شاملة من قوالب فيديو الزفاف السينمائية بجودة 4K. تشمل تأثيرات انتقالية، وفلاتر لونية، ونصوص متحركة. مناسبة لمونتيري الفيديو المحترفين.",
      longDescriptionEn: "Comprehensive collection of cinematic wedding video templates in 4K quality. Includes transitions, color filters, and animated text. Suitable for professional video editors.",
      price: "189",
      originalPrice: "379",
      discount: 50,
      image: "/images/products/wedding.jpg",
      categoryId: 2,
      fileType: "AE, PR",
      fileSize: "12 GB",
      features: '["4K Quality","50+ Templates","Color Grading","Transitions Pack","Commercial License"]',
      rating: "4.9",
      reviewCount: 289,
      salesCount: 1543,
      isFeatured: true,
    },
    {
      slug: "yoga-meditation-videos",
      titleAr: "فيديوهات اليوجا والتأمل 4K",
      titleEn: "Yoga & Meditation Videos 4K",
      descriptionAr: "فيديوهات احترافية لليوجا والتأمر بدقة 4K",
      descriptionEn: "Professional yoga and meditation videos in 4K",
      price: "169",
      originalPrice: "339",
      discount: 50,
      image: "/images/products/yoga.jpg",
      categoryId: 2,
      fileType: "MP4",
      fileSize: "8 GB",
      features: '["4K Resolution","100+ Videos","Royalty Free","Nature Sounds","Commercial Use"]',
      rating: "4.8",
      reviewCount: 234,
      salesCount: 987,
      isFeatured: true,
    },
    {
      slug: "ecommerce-encyclopedia",
      titleAr: "موسوعة التجارة الإلكترونية الشاملة",
      titleEn: "Complete E-Commerce Encyclopedia",
      descriptionAr: "دليلك الشامل لبناء متجر إلكتروني ناجح من الصفر",
      descriptionEn: "Your complete guide to building a successful online store from scratch",
      price: "99",
      originalPrice: "199",
      discount: 50,
      image: "/images/products/ecommerce.jpg",
      categoryId: 1,
      fileType: "PDF",
      fileSize: "45 MB",
      features: '["500+ Pages","Step by Step","Case Studies","Templates","Lifetime Updates"]',
      rating: "4.9",
      reviewCount: 823,
      salesCount: 3456,
      isFeatured: true,
    },
    {
      slug: "digital-marketing-guide",
      titleAr: "دليل التسويق الرقمي 2025",
      titleEn: "Digital Marketing Guide 2025",
      descriptionAr: "أحدث استراتيجيات التسويق الرقمي لعام 2025",
      descriptionEn: "Latest digital marketing strategies for 2025",
      price: "79",
      originalPrice: "159",
      discount: 50,
      image: "/images/products/marketing.jpg",
      categoryId: 1,
      fileType: "PDF",
      fileSize: "32 MB",
      features: '["2025 Updated","SEO Strategies","Social Media","PPC Guides","Analytics"]',
      rating: "4.8",
      reviewCount: 567,
      salesCount: 2134,
      isFeatured: true,
    },
    {
      slug: "islamic-calligraphy",
      titleAr: "مجموعة الخط العربي الإسلامي",
      titleEn: "Islamic Calligraphy Collection",
      descriptionAr: "مجموعة فاخرة من الخطوط العربية الإسلامية",
      descriptionEn: "Premium collection of Islamic Arabic calligraphy",
      price: "149",
      originalPrice: "299",
      discount: 50,
      image: "/images/products/calligraphy.jpg",
      categoryId: 4,
      fileType: "OTF, TTF",
      fileSize: "250 MB",
      features: '["50+ Fonts","Islamic Style","Commercial License","Multilingual","Bonus Vectors"]',
      rating: "4.9",
      reviewCount: 445,
      salesCount: 1876,
      isFeatured: true,
    },
    {
      slug: "ai-tools-collection",
      titleAr: "مجموعة أدوات الذكاء الاصطناعي",
      titleEn: "AI Tools Collection",
      descriptionAr: "أدوات وتطبيقات الذكاء الاصطناعي للمحترفين",
      descriptionEn: "AI tools and applications for professionals",
      price: "199",
      originalPrice: "399",
      discount: 50,
      image: "/images/products/ai-tools.jpg",
      categoryId: 8,
      fileType: "Various",
      fileSize: "3 GB",
      features: '["AI Prompts","Automation Scripts","ChatGPT Guides","Midjourney Pack","Commercial Use"]',
      rating: "4.9",
      reviewCount: 678,
      salesCount: 2345,
      isFeatured: true,
    },
  ];

  for (const product of productsData) {
    await db.insert(products).values(product).onDuplicateKeyUpdate({
      set: product,
    });
  }
  console.log("Products seeded!");

  // Seed social services
  const socialServicesData = [
    { platform: "instagram", serviceType: "followers", nameAr: "متابعين انستقرام", nameEn: "Instagram Followers", price: "49", quantity: 1000, unit: "متابع", deliveryTime: "1-2 ساعة", minQuantity: 100, maxQuantity: 50000 },
    { platform: "tiktok", serviceType: "views", nameAr: "مشاهدات تيك توك", nameEn: "TikTok Views", price: "29", quantity: 10000, unit: "مشاهدة", deliveryTime: "30 دقيقة", minQuantity: 1000, maxQuantity: 1000000 },
    { platform: "youtube", serviceType: "subscribers", nameAr: "مشتركين يوتيوب", nameEn: "YouTube Subscribers", price: "79", quantity: 1000, unit: "مشترك", deliveryTime: "2-4 ساعات", minQuantity: 100, maxQuantity: 100000 },
    { platform: "whatsapp", serviceType: "views", nameAr: "مشاهدات واتساب", nameEn: "WhatsApp Views", price: "39", quantity: 500, unit: "مشاهدة", deliveryTime: "15 دقيقة", minQuantity: 100, maxQuantity: 50000 },
    { platform: "twitter", serviceType: "followers", nameAr: "متابعين تويتر", nameEn: "Twitter Followers", price: "59", quantity: 1000, unit: "متابع", deliveryTime: "1-3 ساعات", minQuantity: 100, maxQuantity: 100000 },
  ];

  for (const service of socialServicesData) {
    await db.insert(socialServices).values(service).onDuplicateKeyUpdate({
      set: service,
    });
  }
  console.log("Social services seeded!");

  console.log("Seeding complete!");
}

seed().catch(console.error);
