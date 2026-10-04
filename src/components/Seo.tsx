import { useEffect } from 'react';
import { useLocation } from 'react-router';

const descriptions: Record<string, [string, string]> = {
  '/': [
    'ديج زوم | متجر الاشتراكات والألعاب والبرامج',
    'تسوّق الاشتراكات وبطاقات الشحن والألعاب والبرامج وأدوات الذكاء الاصطناعي والقوالب الرقمية، في مكان واحد.',
  ],
  '/store': ['متجر ديج زوم | اشتراكات وألعاب وبرامج', 'تسوّق الاشتراكات وبطاقات الشحن والألعاب والبرامج وأدوات الذكاء الاصطناعي والقوالب الرقمية، في مكان واحد.'],
  '/shop': ['تصفّح المنتجات | ديج زوم', 'تسوّق الاشتراكات وبطاقات الشحن والألعاب والبرامج وأدوات الذكاء الاصطناعي والقوالب الرقمية، في مكان واحد.'],
  '/marketing': ['إدارة المواقع والتسويق | ديج زوم', 'نحدّث موقعك ومنتجاتك وعروضك، ونصمّم محتوى حساباتك بخطة واضحة.'],
  '/about': ['عن DigZoom', 'تعرف على DigZoom وخدمات النمو الرقمي.'],
  '/contact': ['تواصل مع DigZoom', 'تواصل مع فريق DigZoom للاستفسارات والخدمات.'],
};

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value);
}

export default function Seo() {
  const location = useLocation();
  useEffect(() => {
    const basePath = location.pathname.startsWith('/product/') ? '/shop' : location.pathname;
    const [title, description] = descriptions[basePath] || [
      'ديج زوم | متجر الاشتراكات والألعاب والبرامج',
      'تسوّق الاشتراكات وبطاقات الشحن والألعاب والبرامج وأدوات الذكاء الاصطناعي والقوالب الرقمية، في مكان واحد.',
    ];
    const canonical = `https://digzoom.com${location.pathname === '/' ? '' : location.pathname}`;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
  }, [location.pathname]);
  return null;
}
