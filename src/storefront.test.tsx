// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Link, MemoryRouter, Route, Routes, useMatch } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ar from '@/i18n/ar.json';
import en from '@/i18n/en.json';
import type { Product } from '@/types/database';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { CartProvider } from '@/hooks/useCart';
import { fetchCatalog } from '@/lib/catalog';
import initialHtml from '../index.html?raw';

const language = vi.hoisted(() => ({ lang: 'en' as 'ar' | 'en' }));
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({ lang: language.lang, t: language.lang === 'en' ? en : ar }),
}));
vi.mock('@/lib/catalog', () => ({ fetchCatalog: vi.fn() }));

const products = [{
  id: 5,
  title: 'تقويم المحتوى لمدة 90 يوماً',
  title_en: '90 Day Content Calendar',
  description: 'خطط للمحتوى',
  description_en: 'Plan your content',
  long_description: 'وصف التقويم',
  long_description_en: 'Calendar description',
  image_url: '/images/calendar.jpg',
  features: ['ثنائي اللغة AR + EN', 'قابل للتعديل', 'تعليمات استخدام', '90 صفاً للتخطيط', 'لوحة مؤشرات تفاعلية', 'بيانات تجريبية واقعية', 'معادلات وحسابات تلقائية'],
  price: 39,
  category_id: 1,
  in_stock: true,
}, {
  id: 6,
  title: 'متتبع ميزانية التسويق والعائد',
  title_en: 'Marketing Budget and ROI Tracker',
  description: 'وصف الميزانية',
  description_en: 'Track your marketing budget',
  image_url: '/images/budget.jpg',
  features: ['حساب ROI تلقائي'],
  price: 49,
  category_id: 1,
  in_stock: true,
}] as Product[];

function StorefrontRoutes() {
  const isProductRoute = useMatch('/product/:id');
  return <>
    {!isProductRoute && <Seo />}
    <Link data-testid="next-product" to="/product/6">Next product</Link>
    <Link data-testid="contact" to="/contact">Contact</Link>
    <Link data-testid="invalid-product" to="/product/5/extra">Invalid route</Link>
    <Routes>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<p>Other page</p>} />
    </Routes>
    <Footer />
  </>;
}

let root: Root;
let container: HTMLDivElement;

async function render(path = '/product/5') {
  await act(async () => {
    root.render(<CartProvider><MemoryRouter initialEntries={[path]}><StorefrontRoutes /></MemoryRouter></CartProvider>);
  });
}

async function click(selector: string) {
  const element = container.querySelector<HTMLElement>(selector);
  expect(element, selector).not.toBeNull();
  await act(async () => element!.click());
}

const meta = (name: string) => document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.getAttribute('content');
const savedCart = () => JSON.parse(localStorage.getItem('digzoom_cart_v2') || '[]');

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  sessionStorage.clear();
  language.lang = 'en';
  vi.mocked(fetchCatalog).mockReset().mockResolvedValue({ products, categories: [] });
  document.head.innerHTML = initialHtml.match(/<head>([\s\S]*?)<\/head>/)![1];
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe('storefront integration', () => {
  it('updates all product metadata and features immediately when language changes', async () => {
    await render();
    expect(document.title).toBe('90 Day Content Calendar | DigZoom');
    expect(meta('twitter:title')).toBe(document.title);
    expect(meta('og:title')).toBe(document.title);
    expect(meta('twitter:description')).toBe('Plan your content');
    expect(meta('twitter:url')).toBe('https://digzoom.com/product/5');
    expect(meta('og:url')).toBe(meta('twitter:url'));
    expect(container.querySelector('ul')?.textContent).toContain('90 planning rows');
    expect(container.querySelector('ul')?.textContent).not.toMatch(/[\u0600-\u06ff]/);

    language.lang = 'ar';
    await render();
    expect(document.title).toBe('تقويم المحتوى لمدة 90 يوماً | DigZoom');
    expect(meta('twitter:title')).toBe(document.title);
    expect(meta('og:locale')).toBe('ar_SA');
    expect(container.querySelector('ul')?.textContent).toContain('90 صفاً للتخطيط');
    expect(document.querySelectorAll('script[data-product-schema]')).toHaveLength(1);

    language.lang = 'en';
    await render();
    expect(document.title).toBe('90 Day Content Calendar | DigZoom');
    expect(document.querySelectorAll('meta[name="twitter:title"]')).toHaveLength(1);
  });

  it('replaces product metadata on SPA navigation and clears it on regular and unmatched routes', async () => {
    await render();
    await click('[data-testid="next-product"]');
    expect(document.title).toBe('Marketing Budget and ROI Tracker | DigZoom');
    expect(meta('twitter:url')).toBe('https://digzoom.com/product/6');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(meta('twitter:url'));
    await click('[data-testid="contact"]');
    expect(document.title).toBe('Contact DigZoom');
    expect(meta('twitter:url')).toBe('https://digzoom.com/contact');
    expect(document.querySelectorAll('script[data-product-schema]')).toHaveLength(0);
    await click('[data-testid="invalid-product"]');
    expect(document.title).toBe('DigZoom | Subscriptions, Games and Software');
    expect(meta('twitter:url')).toBe('https://digzoom.com/product/5/extra');
  });

  it('keeps newer navigation when an older catalog request finishes late', async () => {
    let finishOldRequest!: (value: Awaited<ReturnType<typeof fetchCatalog>>) => void;
    vi.mocked(fetchCatalog).mockImplementationOnce(() => new Promise(resolve => { finishOldRequest = resolve; }));
    await render();
    expect(document.title).toBe('Browse Products | DigZoom');
    await click('[data-testid="next-product"]');
    expect(document.title).toBe('Marketing Budget and ROI Tracker | DigZoom');
    await act(async () => finishOldRequest({ products, categories: [] }));
    expect(document.title).toBe('Marketing Budget and ROI Tracker | DigZoom');
    expect(meta('twitter:url')).toBe('https://digzoom.com/product/6');
  });

  it('retains accessible quantity and remove controls in both languages and their repeated actions work', async () => {
    localStorage.setItem('digzoom_cart_v2', JSON.stringify([{ ...products[0], quantity: 1 }]));
    await render('/cart');
    expect(container.querySelector('[aria-label="Decrease quantity of 90 Day Content Calendar"]')).not.toBeNull();
    await click('[aria-label="Increase quantity of 90 Day Content Calendar"]');
    await click('[aria-label="Increase quantity of 90 Day Content Calendar"]');
    expect(savedCart()[0].quantity).toBe(3);
    await click('[aria-label="Decrease quantity of 90 Day Content Calendar"]');
    expect(savedCart()[0].quantity).toBe(2);
    language.lang = 'ar';
    await render('/cart');
    expect(container.querySelector('[aria-label="زيادة كمية تقويم المحتوى لمدة 90 يوماً"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="تقليل كمية تقويم المحتوى لمدة 90 يوماً"]')).not.toBeNull();
    await click('[aria-label="إزالة من السلة: تقويم المحتوى لمدة 90 يوماً"]');
    expect(savedCart()).toEqual([]);
    expect(container.textContent).toContain(ar.cart.emptyTitle);
  });

  it('uses the normalized WhatsApp destination without contacting WhatsApp', async () => {
    await render('/contact');
    expect(container.querySelector('a[href^="https://wa.me/"]')?.getAttribute('href')).toBe('https://wa.me/966569888456');
  });
});
