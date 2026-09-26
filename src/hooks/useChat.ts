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
      response: 'يمكنك الآن تصفح المنتجات وفتح صفحة كل منتج للاطلاع على الصور والمزايا. 🛍️\n\nأضف المنتج إلى السلة، ثم أدخل اسمك وبريدك ورقم جوالك في صفحة الدفع. يمكن الشراء دون إنشاء حساب، وستنتقل بعدها إلى بوابة Stripe لإكمال الدفع.',
      suggestions: ['طرق الدفع', 'كيف أحمل المنتج؟', 'المنتجات المتوفرة']
    },
    {
      keywords: ['دفع', 'الدفع', 'فيزا', 'ماستر', 'مدى', 'بطاقة', 'أبل باي', 'جوجل باي', 'سترايب', 'حوالة', 'تحويل'],
      response: 'الشراء الإلكتروني متاح عبر Stripe. تظهر طرق الدفع المتاحة لك في صفحة الدفع الآمنة بعد مراجعة طلبك؛ لا ندخل بيانات البطاقة داخل موقعنا.',
      suggestions: ['الأسعار', 'كيف أشتري؟', 'ضمان الاسترجاع']
    },
    {
      keywords: ['تحميل', 'احمل', 'أحمل', 'الملف', 'الملفات', 'ينزل', 'نزل', 'تنزيل', '_DOWNLOAD_', 'download', 'فتح', 'وصل'],
      response: 'ملفات المنتجات محفوظة بشكل خاص. بعد تأكيد الدفع، افتح صفحة تأكيد الطلب لتحصل على رابط تنزيل آمن؛ إذا اشتريت بحسابك يمكنك الرجوع إلى «طلباتي». لا توجد روابط ملفات عامة.',
      suggestions: ['مشكلة في التحميل', 'كيف أشتري؟', 'تواصل مع الدعم']
    },
    {
      keywords: ['استرجاع', 'رجع', 'استرداد', 'فلوس', 'للأسف', 'ما عجبني', 'رد', 'المنتج ما يشتغل', 'عطلان', 'مكسور', 'ما يفتح'],
      response: 'إذا واجهتك مشكلة بعد الشراء، تواصل معنا من صفحة "اتصل بنا" أو عبر info@digzoom.com. تُراجع طلبات الاسترجاع وفق سياسة الاسترجاع المنشورة وشروط المنتجات الرقمية.',
      suggestions: ['تواصل مع الدعم', 'سياسة الاسترجاع', 'المنتج ما يشتغل']
    },
    {
      keywords: ['منتج', 'منتجات', 'كتب', 'قوالب', 'فيديو', 'صور', 'خطوط', 'كورسات', 'تصاميم', 'PLR', 'مكتبة', 'عندكم'],
      response: 'المتجر يعرض حالياً 10 قوالب Excel للتسويق والمحتوى والميزانية والمبيعات والتخطيط. 📊\n\nكل منتج يتضمن بيانات نموذجية وصيغاً ولوحة معلومات وتعليمات بالعربية والإنجليزية.',
      suggestions: ['المنتجات الأكثر مبيعاً', 'كيف أشتري؟', 'الاشتراكات']
    },
    {
      keywords: ['سعر', 'أسعار', 'السعر', 'بكم', 'كام', 'رخيص', 'غالي', 'تكلفة', 'درهم', 'دولار', 'ريال', 'خصم', 'عرض', 'تخفيض'],
      response: 'تظهر أسعار المنتجات بالريال السعودي في المتجر. يمكنك إدخال كوبون في صفحة الدفع؛ تأكد من المبلغ النهائي قبل الانتقال إلى Stripe.',
      suggestions: ['الاشتراكات', 'كيف أشتري؟', 'طرق الدفع']
    },
    {
      keywords: ['اشتراك', 'اشتراكات', 'شهري', 'سنوي', 'باقة', 'خطة', 'Subscribe', 'subscription', 'pro', 'أعمال', 'أساسي'],
      response: 'منتجات المتجر تُشترى مرة واحدة. توجد باقات شهرية لخدمات الموقع والمحتوى؛ دفع الشهر الأول لا ينشئ تجديداً تلقائياً.',
      suggestions: ['كيف أشترك؟', 'المنتجات المتوفرة', 'طرق الدفع']
    },
    {
      keywords: ['دعم', 'مساعدة', 'مساعدتي', 'مشكلة', 'مشكلتي', 'مساعدة', 'ساعدني', 'ساعد', 'فزعة', 'مساعده', 'تواصل', 'واتس', 'واتساب', 'اتصال', 'كلم', 'رقم', 'تلفون', 'جوال', 'هاتف', 'whatsapp', 'اتصل', 'شكوى', 'ابلاغ'],
      response: 'فريق الدعم جاهز يساعدك! 🛎️\n\n📱 واتساب: 00966569888456\n📧 بريد: info@digzoom.com\n💬 أو ابقى معي هنا في الدردشة.\n\nنرد عادة خلال 24 ساعة عمل.',
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
      response: 'You can browse the catalog and open each product page to review its previews and features. 🛍️\n\nAdd the product to your cart and enter your name, email, and phone at checkout. No account is required; Stripe handles secure payment.',
      suggestions: ['Payment methods', 'How to download?', 'Available products']
    },
    {
      keywords: ['pay', 'payment', 'visa', 'mastercard', 'mada', 'card', 'apple pay', 'google pay', 'stripe', 'credit card'],
      response: 'Online checkout is available through Stripe. Available payment methods appear on the secure payment page after you review your order.',
      suggestions: ['Pricing', 'How to buy?', 'Refund policy']
    },
    {
      keywords: ['download', 'get file', 'files', 'extract', 'save', 'link'],
      response: 'Product files are private. After payment is verified, open the order confirmation page for a secure download. Signed-in purchases also appear under My Orders.',
      suggestions: ['Download issue', 'How to buy?', 'Contact support']
    },
    {
      keywords: ['refund', 'return', 'money back', 'not working', 'broken', 'issue', 'problem', 'doesn\'t work'],
      response: 'If you encounter an issue after purchase, contact us through the Contact page or at info@digzoom.com. Refund requests are reviewed under the published refund policy and its terms for digital products.',
      suggestions: ['Contact support', 'Refund policy', 'Download issue']
    },
    {
      keywords: ['products', 'product', 'books', 'templates', 'videos', 'images', 'fonts', 'courses', 'designs', 'plr', 'library', 'what do you have'],
      response: 'The store currently features 10 Excel templates for marketing, content planning, budgeting, sales, and strategy. 📊\n\nEach includes sample data, formulas, a dashboard, and Arabic/English instructions.',
      suggestions: ['Best sellers', 'How to buy?', 'Subscriptions']
    },
    {
      keywords: ['price', 'prices', 'cost', 'how much', 'cheap', 'expensive', 'discount', 'offer', 'sale', 'deal', 'promo'],
      response: 'Prices appear in SAR. You can apply a coupon at checkout; review the final amount before continuing to Stripe.',
      suggestions: ['Subscriptions', 'How to buy?', 'Payment methods']
    },
    {
      keywords: ['subscription', 'subscribe', 'monthly', 'yearly', 'plan', 'pro', 'business', 'basic'],
      response: 'Store products are one-time purchases. Monthly website and content service plans are available; paying for the first month does not renew automatically.',
      suggestions: ['How to subscribe?', 'Available products', 'Payment methods']
    },
    {
      keywords: ['support', 'help', 'assist', 'contact', 'whatsapp', 'phone', 'call', 'number', 'reach', 'complaint', 'report', 'customer service'],
      response: 'Our support team is ready to help! 🛎️\n\n📱 WhatsApp: 00966569888456\n📧 Email: info@digzoom.com\n💬 Or chat with me right here.\n\nWe usually respond within one business day.',
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
  ar: 'أنا آسف، ما فهمت سؤالك بالضبط 🤔\n\nتقدر تسأل عن:\n• المنتجات المتوفرة 📚\n• حالة الدفع 💳\n• التسليم الآمن 📥\n• التواصل مع الدعم 🛎️\n\nأو تواصل معنا مباشرة 📱 00966569888456',
  en: 'I\'m sorry, I didn\'t quite understand 🤔\n\nYou can ask about:\n• Available products 📚\n• Payment status 💳\n• Secure delivery 📥\n• Contacting support 🛎️\n\nOr contact us directly 📱 00966569888456',
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
          ? 'أهلاً وسهلاً بك في digzoom! 🎉 كيف أقدر أساعدك اليوم؟'
          : 'Welcome to digzoom! 🎉 How can I help you today?',
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
