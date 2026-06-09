/**
 * Bilingual helper for products and content.
 * Returns the English version when lang='en', Arabic otherwise.
 */
export function bilingual(
  lang: string,
  ar: string | null | undefined,
  en: string | null | undefined
): string {
  if (lang === 'en' && en && en.trim().length > 0) {
    return en;
  }
  return ar || en || '';
}

/**
 * Get localized product title based on current language.
 */
export function productTitle(product: any, lang: string): string {
  if (lang === 'en') {
    return product.title_en || product.title || '';
  }
  return product.title_ar || product.title || '';
}

/**
 * Get localized product description based on current language.
 */
export function productDescription(product: any, lang: string): string {
  if (lang === 'en') {
    return product.description_en || product.description || '';
  }
  return product.description_ar || product.description || '';
}

/**
 * Get localized long description based on current language.
 */
export function productLongDescription(product: any, lang: string): string {
  if (lang === 'en') {
    return product.long_description_en || product.longDescription_en || product.long_description || product.longDescription || '';
  }
  return product.long_description_ar || product.longDescription_ar || product.long_description || product.longDescription || '';
}
