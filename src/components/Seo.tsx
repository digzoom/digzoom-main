import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import type { Product } from '@/types/database';
import { pageMetadata } from '@/lib/seo';

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value);
}

export default function Seo({ product }: { product?: Product | null }) {
  const location = useLocation();
  const { lang } = useLanguage();
  useEffect(() => {
    const { title, description, canonical, image, locale } = pageMetadata(location.pathname, lang, product);
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:locale"]', locale);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:url"]', canonical);
    setMeta('meta[name="twitter:image"]', image);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
  }, [location.pathname, lang, product]);
  return null;
}
