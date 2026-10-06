import type { Product } from '@/types/database';
import { matchPath } from 'react-router';
import { productDescription, productLongDescription, productTitle } from '@/lib/i18n';

type Metadata = { title: string; description: string; canonical: string; image: string; locale: string };
type LocalizedText = Record<'ar' | 'en', [string, string]>;
const defaultImage = 'https://digzoom.com/images/digzoom-logo-side-new.jpg';

function metadataImage(image?: string): string {
  if (!image) return defaultImage;
  try {
    const url = new URL(image, 'https://digzoom.com');
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : defaultImage;
  } catch {
    return defaultImage;
  }
}

const catalogDescription = {
  ar: 'تسوّق الاشتراكات وبطاقات الشحن والألعاب والبرامج وأدوات الذكاء الاصطناعي والقوالب الرقمية، في مكان واحد.',
  en: 'Shop subscriptions, gift cards, games, software, AI tools and digital templates in one place.',
};

const descriptions: Record<string, LocalizedText> = {
  '/': {
    ar: ['ديج زوم | متجر الاشتراكات والألعاب والبرامج', catalogDescription.ar],
    en: ['DigZoom | Subscriptions, Games and Software', catalogDescription.en],
  },
  '/store': {
    ar: ['متجر ديج زوم | اشتراكات وألعاب وبرامج', catalogDescription.ar],
    en: ['DigZoom Store | Subscriptions, Games and Software', catalogDescription.en],
  },
  '/shop': {
    ar: ['تصفّح المنتجات | ديج زوم', catalogDescription.ar],
    en: ['Browse Products | DigZoom', catalogDescription.en],
  },
  '/marketing': {
    ar: ['إدارة المواقع والتسويق | ديج زوم', 'نحدّث موقعك ومنتجاتك وعروضك، ونصمّم محتوى حساباتك بخطة واضحة.'],
    en: ['Website Management and Marketing | DigZoom', 'Keep your website, products and offers up to date, with a clear plan for your social content.'],
  },
  '/about': {
    ar: ['عن DigZoom', 'تعرف على DigZoom وخدمات النمو الرقمي.'],
    en: ['About DigZoom', 'Learn about DigZoom and our digital growth services.'],
  },
  '/contact': {
    ar: ['تواصل مع DigZoom', 'تواصل مع فريق DigZoom للاستفسارات والخدمات.'],
    en: ['Contact DigZoom', 'Contact the DigZoom team for questions and services.'],
  },
};

export function pageMetadata(pathname: string, lang: 'ar' | 'en', product?: Product | null): Metadata {
  const productRoute = matchPath('/product/:id', pathname);
  const basePath = productRoute ? '/shop' : pathname;
  const [title, description] = (descriptions[basePath] ?? descriptions['/'])[lang];
  const isCurrentProduct = product && productRoute && Number(productRoute.params.id) === product.id;

  return {
    title: isCurrentProduct ? `${productTitle(product, lang)} | DigZoom` : title,
    description: isCurrentProduct ? productDescription(product, lang) || productLongDescription(product, lang) || description : description,
    canonical: `https://digzoom.com${pathname === '/' ? '' : pathname}`,
    image: metadataImage(isCurrentProduct ? product.image_url : undefined),
    locale: lang === 'ar' ? 'ar_SA' : 'en_US',
  };
}
