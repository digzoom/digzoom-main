import { useEffect } from 'react';
import { useLocation } from 'react-router';

const descriptions: Record<string, [string, string]> = {
  '/': [
    'DigZoom | إدارة المواقع والتسويق والمنتجات الرقمية',
    'خدمات إدارة المواقع والتسويق الرقمي، مع متجر للمنتجات الرقمية وحلول عملية تساعد المنشآت والأفراد على بناء حضور رقمي وتحقيق نمو قابل للقياس.',
  ],
  '/store': ['متجر المنتجات الرقمية | DigZoom', 'منتجات رقمية عملية وآمنة من DigZoom.'],
  '/shop': ['تصفح المنتجات الرقمية | DigZoom', 'تصفح منتجات DigZoom الرقمية المتاحة.'],
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
      'DigZoom | إدارة المواقع والتسويق والمنتجات الرقمية',
      'خدمات إدارة المواقع والتسويق الرقمي ومنتجات رقمية عملية من DigZoom.',
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
