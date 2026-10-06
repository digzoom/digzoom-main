import { describe, expect, it } from 'vitest';
import type { Product } from '@/types/database';
import { pageMetadata } from './seo';

const product = {
  id: 5,
  title: 'تقويم المحتوى لمدة 90 يوماً',
  title_ar: 'تقويم المحتوى لمدة 90 يوماً',
  title_en: '90 Day Content Calendar',
  description: 'خطط للمحتوى',
  description_ar: 'خطط للمحتوى',
  description_en: 'Plan your content',
  image_url: '/images/calendar.jpg',
} as Product;

describe('pageMetadata', () => {
  it('uses the current product and language for its title and description', () => {
    expect(pageMetadata('/product/5', 'en', product)).toEqual({
      title: '90 Day Content Calendar | DigZoom',
      description: 'Plan your content',
      canonical: 'https://digzoom.com/product/5',
      image: 'https://digzoom.com/images/calendar.jpg',
      locale: 'en_US',
    });
    expect(pageMetadata('/product/5', 'ar', product).title).toBe('تقويم المحتوى لمدة 90 يوماً | DigZoom');
    expect(pageMetadata('/product/5', 'ar', product).description).toBe('خطط للمحتوى');
  });

  it('does not apply a stale product while navigating to another product', () => {
    const metadata = pageMetadata('/product/6', 'en', product);
    expect(metadata.title).toBe('Browse Products | DigZoom');
    expect(metadata.canonical).toBe('https://digzoom.com/product/6');
  });

  it('matches the same product route variants as the router', () => {
    for (const pathname of ['/Product/5', '/product/05', '/product/5/']) {
      expect(pageMetadata(pathname, 'en', product).title).toBe('90 Day Content Calendar | DigZoom');
    }
  });

  it('provides localized fallbacks while loading or when a product is missing', () => {
    expect(pageMetadata('/product/5', 'en', null).title).toBe('Browse Products | DigZoom');
    expect(pageMetadata('/product/5', 'ar').title).toBe('تصفّح المنتجات | ديج زوم');
  });

  it('resets route metadata after leaving a product', () => {
    expect(pageMetadata('/contact', 'en', product).title).toBe('Contact DigZoom');
    expect(pageMetadata('/', 'ar').canonical).toBe('https://digzoom.com');
    expect(pageMetadata('/about', 'en').locale).toBe('en_US');
    expect(pageMetadata('/unknown', 'ar').title).toBe(pageMetadata('/', 'ar').title);
  });

  it('falls back safely when catalog images are invalid or not HTTP URLs', () => {
    for (const image_url of ['https://', 'javascript:alert(1)', 'data:image/png;base64,abc', '']) {
      expect(pageMetadata('/product/5', 'en', { ...product, image_url }).image)
        .toBe('https://digzoom.com/images/digzoom-logo-side-new.jpg');
    }
  });
});
