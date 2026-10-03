export interface SectionBrand { id: string; ar: string; en: string; terms: string[]; mark: string }
export interface StorefrontSection { slug: string; ar: string; en: string; accent: string; motif: string; image: string; brands: SectionBrand[] }
const brand = (id: string, ar: string, en: string, mark: string, terms: string[] = []): SectionBrand => ({ id, ar, en, mark, terms: [ar, en, ...terms] });
export const storefrontSections: StorefrontSection[] = [
 { slug: 'subscriptions', ar: 'الاشتراكات', en: 'Subscriptions', accent: '#be185d', motif: 'stream', image: 'subscriptions', brands: [brand('shahid','شاهد','Shahid','▶',['شاهد نت']),brand('netflix','نتفلكس','Netflix','N',['نتفليكس']),brand('youtube','يوتيوب','YouTube','▶'),brand('spotify','سبوتيفاي','Spotify','♫')] },
 { slug: 'ai', ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence', accent: '#0e7490', motif: 'circuit', image: 'ai', brands: [brand('chatgpt','ChatGPT','ChatGPT','AI',['شات جي بي تي']),brand('gemini','Gemini','Gemini','✦',['جيميني']),brand('claude','Claude','Claude','✳',['كلود']),brand('copilot','Copilot','Copilot','AI',['كوبايلوت'])] },
 { slug: 'software', ar: 'البرامج', en: 'Software', accent: '#1d4ed8', motif: 'window', image: 'software', brands: [brand('windows','ويندوز','Windows','⊞'),brand('office','مايكروسوفت أوفيس','Microsoft Office','O',['office','أوفيس']),brand('adobe','أدوبي','Adobe','A'),brand('security','الحماية وVPN','Security & VPN','✓',['antivirus','vpn','حماية'])] },
 { slug: 'gaming', ar: 'الألعاب', en: 'Gaming', accent: '#7c3aed', motif: 'gaming', image: 'gaming', brands: [brand('playstation','بلايستيشن','PlayStation','△',['بلاي ستيشن']),brand('xbox','إكس بوكس','Xbox','X',['اكس بوكس']),brand('steam','ستيم','Steam','◉'),brand('roblox','روبلوكس','Roblox','◇')] },
 { slug: 'templates', ar: 'المنتجات الرقمية', en: 'Digital Products', accent: '#047857', motif: 'paper', image: 'digital-products', brands: [] },
 { slug: 'recharge', ar: 'بطاقات الشحن والاتصالات', en: 'Recharge & Telecom', accent: '#b45309', motif: 'signal', image: 'recharge', brands: [brand('stc','STC','STC','stc'),brand('mobily','موبايلي','Mobily','M'),brand('zain','زين','Zain','Z'),brand('virgin','فيرجن','Virgin','V'),brand('lebara','ليبارا','Lebara','L')] },
].map(section => ({ ...section, image: `/images/digzoom/categories/${section.image}-approved.webp` }));
export const getStorefrontSection = (slug: string) => storefrontSections.find(section => section.slug === slug);
export function normalizeCatalogText(text: string) { return text.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\p{L}\p{N}]+/gu,' ').trim(); }
export function matchesBrand(product: { title?: string; title_ar?: string | null; title_en?: string | null; slug?: string }, brand: SectionBrand) {
 const text = ` ${normalizeCatalogText([product.title,product.title_ar,product.title_en,product.slug].filter(Boolean).join(' '))} `;
 return brand.terms.some(term => text.includes(` ${normalizeCatalogText(term)} `));
}
