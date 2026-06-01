import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatResponse {
  keywords: string[];
  response: string;
  suggestions?: string[];
}

const botResponses: Record<string, ChatResponse[]> = {
  ar: [
    {
      keywords: ['مرحبا', 'هلا', 'السلام', 'عليكم', 'هاي', 'أهلا', 'حياك', 'سلام'],
      response: 'أهلاً وسهلاً بك في digzoom! 🎉 أنا مساعدك الذكي، كيف أقدر أساعدك اليوم؟',
      suggestions: ['كيف أشتري منتج؟', 'طرق الدفع', 'كيف أحمل المنتج؟']
    },
    {
      keywords: ['شراء', 'اشتري', 'أشتري', 'شرى', 'اشتر', 'طلب', 'اطلب', 'أطلب', 'تسوق', 'أشتري', 'آخذ', 'أخذ'],
      response: 'عملية الشراء سهلة جداً! 📦\n\n1. تصفح المتجر واختر المنتج اللي يعجبك\n2. اضغط "أضف للسلة" 🛒\n3. اذهب لصفحة الدفع واملأ بياناتك\n4. ادفع بأي طريقة تناسبك\n5. تحصل على رابط التحميل فوراً بعد الدفع ✅',
      suggestions: ['طرق الدفع', 'كيف أحمل المنتج؟', 'المنتجات المتوفرة']
    },
    {
      keywords: ['دفع', 'الدفع', 'فيزا', 'ماستر', 'مدى', 'بطاقة', 'أبل باي', 'جوجل باي', 'سترايب', 'حوالة', 'تحويل'],
      response: 'نقبل جميع طرق الدفع الشائعة 💳:\n\n• Visa / Mastercard\n• Apple Pay 🍎\n• Google Pay 🤖\n• مدى (Mada)\n• Stripe\n\nكل المعاملات مشفرة وآمنة 100% 🔒',
      suggestions: ['الأسعار', 'كيف أشتري؟', 'ضمان الاسترجاع']
    },
    {
      keywords: ['تحميل', 'احمل', 'أحمل', 'الملف', 'الملفات', 'ينزل', 'نزل', 'تنزيل', '_DOWNLOAD_', 'download', 'فتح', 'وصل'],
      response: 'بعد إتمام الشراء مباشرة: 📥\n\n1. اذهب لصفحة "طلباتي" في حسابك\n2. اضغط على المنتج اللي اشتريته\n3. اضغط "تحميل" واحفظ الملف\n\n⚡ المنتجات رقمية 100% - التحميل فوري بعد الدفع!\n📧 كمان نرسل لك رابط التحميل على بريدك الإلكتروني.',
      suggestions: ['مشكلة في التحميل', 'كيف أشتري؟', 'تواصل مع الدعم']
    },
    {
      keywords: ['استرجاع', 'رجع', 'استرداد', 'فلوس', 'للأسف', 'ما عجبني', 'رد', 'المنتج ما يشتغل', 'عطلان', 'مكسور', 'ما يفتح'],
      response: 'لا تقلق! 😊 عندك ضمان استرجاع كامل لمدة 30 يوم 📅\n\nإذا واجهتك أي مشكلة أو ما كنت راضي عن المنتج:\n\n1. تواصل معنا من صفحة "اتصل بنا"\n2. أو راسلنا على واتساب 📱\n\nنرجع لك فلوسك كاملة بدون أي أسئلة! 💰',
      suggestions: ['تواصل مع الدعم', 'سياسة الاسترجاع', 'المنتج ما يشتغل']
    },
    {
      keywords: ['منتج', 'منتجات', 'كتب', 'قوالب', 'فيديو', 'صور', 'خطوط', 'كورسات', 'تصاميم', 'PLR', 'مكتبة', 'عندكم'],
      response: 'عندنا أكثر من 150 منتج رقمي متنوع 🎨:\n\n📚 كتب إلكترونية (21+)\n📋 قوالب جاهزة (21+)\n🎬 فيديوهات وكورسات\n🎵 صوتيات ومؤثرات\n💻 أكواد ومواقع\n📷 صور احترافية\n🎨 خطوط عربية\n🎲 نماذج 3D\n🖼️ تصاميم جرافيك (26+)\n\nتصفح المتجر واكتشف بنفسك! 🔥',
      suggestions: ['المنتجات الأكثر مبيعاً', 'كيف أشتري؟', 'الاشتراكات']
    },
    {
      keywords: ['سعر', 'أسعار', 'السعر', 'بكم', 'كام', 'رخيص', 'غالي', 'تكلفة', 'درهم', 'دولار', 'ريال', 'خصم', 'عرض', 'تخفيض'],
      response: 'أسعارنا تبدأ من 29 ر.س فقط! 💰\n\n📌 كل المنتجات بخصم 50% دائم\n📌 اشتر مرة واستفيد مدى الحياة\n📌 تحديثات مجانية\n\n🎁 اشتراكات شهرية تبدأ من 49 ر.س/شهر\n(تحميلات غير محدودة!)',
      suggestions: ['الاشتراكات', 'كيف أشتري؟', 'طرق الدفع']
    },
    {
      keywords: ['اشتراك', 'اشتراكات', 'شهري', 'سنوي', 'باقة', 'خطة', 'Subscribe', 'subscription', 'pro', 'أعمال', 'أساسي'],
      response: 'عندنا 3 خطط اشتراك ممتازة 📦:\n\n⭐ أساسي - 49 ر.س/شهر\n(10 تحميلات، دعم أساسي)\n\n🔥 احترافي - 99 ر.س/شهر\n(تحميلات غير محدودة + ترخيص تجاري)\n\n🏢 أعمال - 199 ر.س/شهر\n(5 أعضاء فريق + API + مدير حساب)\n\nوفر 20% بالاشتراك السنوي!',
      suggestions: ['كيف أشترك؟', 'المنتجات المتوفرة', 'طرق الدفع']
    },
    {
      keywords: ['دعم', 'مساعدة', 'مساعدتي', 'مشكلة', 'مشكلتي', 'مساعدة', 'ساعدني', 'ساعد', 'فزعة', 'مساعده', 'تواصل', 'واتس', 'واتساب', 'اتصال', 'كلم', 'رقم', 'تلفون', 'جوال', 'هاتف', 'whatsapp', 'اتصل', 'شكوى', 'ابلاغ'],
      response: 'فريق الدعم جاهز يساعدك! 🛎️\n\n📱 واتساب: 00966569888456\n📧 بريد: info@digzoom.com\n💬 أو ابقى معي أنا مساعدك الذكي!\n\nمتاحين 24/7 على مدار الساعة 🕐',
      suggestions: ['مشكلة في التحميل', 'المنتج ما يشتغل', 'طلب استرجاع']
    },
    {
      keywords: ['حساب', 'تسجيل', 'دخول', 'أدخل', 'سجل', 'عضو', 'أنشئ حساب', 'تسجيل الدخول', 'نسيت كلمة', 'باسورد', 'password', 'login'],
      response: 'تقدر تسوي حساب بسهولة! 👤\n\n1. اضغط على "دخول" في الأعلى\n2. اختر "تسجيل جديد"\n3. املأ بياناتك (البريد + كلمة المرور)\n4. جاهز! ✅\n\nأو سجل دخول بجوجل مباشرة 🚀',
      suggestions: ['كيف أشتري؟', 'مشكلة في الدخول', 'تواصل مع الدعم']
    },
    {
      keywords: ['لغة', 'انجليزي', 'عربي', 'English', 'تبديل', 'ترجمة', 'translate'],
      response: 'تقدر تبديل اللغة بسهولة! 🌐\n\nاضغط على زر "EN" أو "AR" في الأعلى يمين الشاشة.\nالموقع يدعم العربية والإنجليزية بالكامل ✅',
      suggestions: ['المنتجات المتوفرة', 'كيف أشتري؟', 'تواصل مع الدعم']
    },
    {
      keywords: ['شكرا', 'شكراً', 'شكر', 'تسلم', 'يسلمو', 'جزاك', 'بارك', 'مشكور', 'thanks', 'thank'],
      response: 'عفواً! 😊 أنا في خدمتك دائماً. إذا احتجت أي شي ثاني لا تتردد في السؤال! 🌟',
      suggestions: ['كيف أشتري؟', 'المنتجات المتوفرة', 'مع السلامة']
    },
    {
      keywords: ['سلامة', 'باي', 'وداعا', 'وداعاً', 'bye', 'goodbye', 'مع السلامة'],
      response: 'مع السلامة! 👋 نتمنى لك تجربة ممتعة مع digzoom. نراك قريباً! 🌟',
      suggestions: []
    },
  ],
  en: [
    {
      keywords: ['hello', 'hi', 'hey', 'welcome', 'greetings', 'good morning', 'good evening', 'howdy'],
      response: 'Welcome to digzoom! 🎉 I\'m your AI assistant. How can I help you today?',
      suggestions: ['How to buy?', 'Payment methods', 'How to download?']
    },
    {
      keywords: ['buy', 'purchase', 'order', 'shop', 'get', 'how to buy', 'checkout', 'cart', 'add to cart'],
      response: 'Buying is super easy! 📦\n\n1. Browse the shop and pick a product\n2. Click "Add to Cart" 🛒\n3. Go to checkout and fill your details\n4. Pay with any method you prefer\n5. Get instant download link after payment ✅',
      suggestions: ['Payment methods', 'How to download?', 'Available products']
    },
    {
      keywords: ['pay', 'payment', 'visa', 'mastercard', 'mada', 'card', 'apple pay', 'google pay', 'stripe', 'credit card'],
      response: 'We accept all major payment methods 💳:\n\n• Visa / Mastercard\n• Apple Pay 🍎\n• Google Pay 🤖\n• Mada (Saudi Arabia)\n• Stripe\n\nAll transactions are encrypted and 100% secure 🔒',
      suggestions: ['Pricing', 'How to buy?', 'Refund policy']
    },
    {
      keywords: ['download', 'get file', 'files', 'extract', 'save', 'link'],
      response: 'After completing your purchase: 📥\n\n1. Go to "My Orders" in your account\n2. Click on the product you bought\n3. Hit "Download" and save the file\n\n⚡ All products are 100% digital - instant download!\n📧 We also email you the download link.',
      suggestions: ['Download issue', 'How to buy?', 'Contact support']
    },
    {
      keywords: ['refund', 'return', 'money back', 'not working', 'broken', 'issue', 'problem', 'doesn\'t work'],
      response: 'No worries! 😊 We have a 30-day money-back guarantee 📅\n\nIf you face any issue or aren\'t satisfied:\n\n1. Contact us via "Contact Us" page\n2. Or message us on WhatsApp 📱\n\nWe\'ll refund you 100% - no questions asked! 💰',
      suggestions: ['Contact support', 'Refund policy', 'Download issue']
    },
    {
      keywords: ['products', 'product', 'books', 'templates', 'videos', 'images', 'fonts', 'courses', 'designs', 'plr', 'library', 'what do you have'],
      response: 'We have 150+ digital products 🎨:\n\n📚 E-Books (21+)\n📋 Templates (21+)\n🎬 Videos & Courses\n🎵 Audio & Sound Effects\n💻 Code & Web Assets\n📷 Professional Photos\n🎨 Arabic Fonts\n🎲 3D Models\n🖼️ Graphics (26+)\n\nBrowse the shop and discover more! 🔥',
      suggestions: ['Best sellers', 'How to buy?', 'Subscriptions']
    },
    {
      keywords: ['price', 'prices', 'cost', 'how much', 'cheap', 'expensive', 'discount', 'offer', 'sale', 'deal', 'promo'],
      response: 'Prices start from just 29 SAR! 💰\n\n📌 All products have 50% permanent discount\n📌 Buy once, keep forever\n📌 Free updates included\n\n🎁 Monthly subscriptions from 49 SAR/month\n(Unlimited downloads!)',
      suggestions: ['Subscriptions', 'How to buy?', 'Payment methods']
    },
    {
      keywords: ['subscription', 'subscribe', 'monthly', 'yearly', 'plan', 'pro', 'business', 'basic'],
      response: 'We have 3 subscription plans 📦:\n\n⭐ Basic - 49 SAR/month\n(10 downloads, basic support)\n\n🔥 Pro - 99 SAR/month\n(Unlimited downloads + commercial license)\n\n🏢 Business - 199 SAR/month\n(5 team members + API + account manager)\n\nSave 20% with yearly billing!',
      suggestions: ['How to subscribe?', 'Available products', 'Payment methods']
    },
    {
      keywords: ['support', 'help', 'assist', 'contact', 'whatsapp', 'phone', 'call', 'number', 'reach', 'complaint', 'report', 'customer service'],
      response: 'Our support team is ready to help! 🛎️\n\n📱 WhatsApp: 00966569888456\n📧 Email: info@digzoom.com\n💬 Or chat with me - I\'m your AI assistant!\n\nAvailable 24/7 around the clock 🕐',
      suggestions: ['Download issue', 'Product not working', 'Refund request']
    },
    {
      keywords: ['account', 'register', 'login', 'sign in', 'sign up', 'create account', 'forgot password'],
      response: 'Creating an account is easy! 👤\n\n1. Click "Login" at the top\n2. Choose "Register"\n3. Fill in your details (email + password)\n4. Done! ✅\n\nOr login with Google directly 🚀',
      suggestions: ['How to buy?', 'Login problem', 'Contact support']
    },
    {
      keywords: ['language', 'english', 'arabic', 'switch', 'change lang'],
      response: 'You can switch languages easily! 🌐\n\nClick the "EN" or "AR" button at the top right of the page.\nOur site fully supports both Arabic and English ✅',
      suggestions: ['Available products', 'How to buy?', 'Contact support']
    },
    {
      keywords: ['thank', 'thanks', 'appreciate', 'thx', 'grateful'],
      response: 'You\'re welcome! 😊 I\'m always here to help. If you need anything else, just ask! 🌟',
      suggestions: ['How to buy?', 'Available products', 'Goodbye']
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'cya', 'take care', 'later'],
      response: 'Goodbye! 👋 Enjoy your experience with digzoom. See you soon! 🌟',
      suggestions: []
    },
  ]
};

const defaultResponses: Record<string, string> = {
  ar: 'أنا آسف، ما فهمت سؤالك بالضبط 🤔\n\nتقدر تسأل عن:\n• كيفية الشراء 💳\n• طريقة التحميل 📥\n• طرق الدفع 💰\n• الاشتراكات 📦\n• المنتجات المتوفرة 📚\n\nأو تواصل معنا مباشرة 📱 00966569888456',
  en: 'I\'m sorry, I didn\'t quite understand 🤔\n\nYou can ask about:\n• How to buy 💳\n• Download process 📥\n• Payment methods 💰\n• Subscriptions 📦\n• Available products 📚\n\nOr contact us directly 📱 00966569888456',
};

export function useChat(lang: 'ar' | 'en' = 'ar') {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Welcome message on first open
  const openChat = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    if (messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        text: lang === 'ar'
          ? 'أهلاً وسهلاً بك في digzoom! 🎉 أنا مساعدك الذكي، كيف أقدر أساعدك اليوم؟'
          : 'Welcome to digzoom! 🎉 I\'m your AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
      setSuggestions(lang === 'ar'
        ? ['كيف أشتري منتج؟', 'طرق الدفع', 'المنتجات المتوفرة']
        : ['How to buy?', 'Payment methods', 'Available products']
      );
    }
  }, [lang, messages.length]);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => {
    if (isOpen) closeChat();
    else openChat();
  }, [isOpen, closeChat, openChat]);

  const getBotResponse = useCallback((userText: string): ChatResponse => {
    const text = userText.toLowerCase();
    const responses = botResponses[lang];

    for (const response of responses) {
      if (response.keywords.some(kw => text.includes(kw))) {
        return response;
      }
    }

    return {
      keywords: [],
      response: defaultResponses[lang],
      suggestions: lang === 'ar'
        ? ['كيف أشتري منتج؟', 'طرق الدفع', 'تواصل مع الدعم']
        : ['How to buy?', 'Payment methods', 'Contact support']
    };
  }, [lang]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setSuggestions([]);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(text);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setSuggestions(botResponse.suggestions || []);
    }, 800 + Math.random() * 700);
  }, [getBotResponse]);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return {
    isOpen,
    messages,
    isTyping,
    hasUnread,
    suggestions,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    messagesEndRef,
    chatContainerRef,
    scrollToBottom,
  };
}
