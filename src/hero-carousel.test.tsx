// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DigitalHubHome from '@/pages/DigitalHubHome';

const state = vi.hoisted(() => ({ lang: 'en' as 'ar' | 'en', reducedMotion: false }));
vi.mock('@/hooks/useLanguage', () => ({ useLanguage: () => ({ lang: state.lang }) }));
vi.mock('@/hooks/useSupabaseProducts', () => ({
  useSupabaseProducts: () => ({ products: [], categories: [], loading: false }),
}));
vi.mock('@/hooks/useCart', () => ({ useCart: () => ({ addToCart: vi.fn() }) }));

const copy = {
  en: {
    carousel: 'Discover DigZoom',
    slide: 'Slide',
    pause: 'Pause slideshow to read',
    play: 'Play slideshow',
    shop: 'Explore store',
    titles: ['Your digital world,', 'We manage your website', 'Have a digital product?'],
    ctas: ['Browse departments', 'Explore our services', 'Sell with us'],
  },
  ar: {
    carousel: 'اكتشف DigZoom',
    slide: 'الشريحة',
    pause: 'إيقاف العرض للقراءة',
    play: 'تشغيل العرض المتحرك',
    shop: 'استكشف المتجر',
    titles: ['عالمك الرقمي،', 'ندير موقعك وحساباتك،', 'عندك منتج رقمي؟'],
    ctas: ['تصفح الأقسام', 'شوف خدماتنا', 'بيع منتجاتك معنا'],
  },
};
const images = [
  '/images/digzoom/store-hero-lifestyle-v1.webp',
  '/images/digzoom/growth-hero-live-v3.webp',
  '/images/digzoom/creator-partner-live.webp',
];

let root: Root;
let container: HTMLDivElement;

function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.hash}</output>;
}

async function render() {
  await act(async () => {
    root.render(<MemoryRouter initialEntries={['/']}><DigitalHubHome /><Location /></MemoryRouter>);
  });
}

function hero() {
  const element = container.querySelector<HTMLElement>('[aria-roledescription]');
  expect(element).not.toBeNull();
  return element!;
}

function button(label: string) {
  const element = hero().querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  expect(element, label).not.toBeNull();
  return element!;
}

function link(label: string) {
  const element = [...hero().querySelectorAll<HTMLAnchorElement>('a')].find(item => item.textContent === label);
  expect(element, label).toBeDefined();
  return element!;
}

async function click(element: HTMLElement) {
  await act(async () => element.click());
}

async function advance(milliseconds = 6000) {
  await act(async () => { await vi.advanceTimersByTimeAsync(milliseconds); });
}

async function hover(inside: boolean) {
  await act(async () => {
    hero().dispatchEvent(new MouseEvent(inside ? 'mouseover' : 'mouseout', {
      bubbles: true,
      relatedTarget: document.body,
    }));
  });
}

function expectSlide(index: number) {
  const localized = copy[state.lang];
  const heroImages = [...hero().querySelectorAll<HTMLImageElement>('img')];
  expect(heroImages).toHaveLength(3);
  const activeImages = heroImages.filter(image => image.parentElement?.getAttribute('aria-hidden') === 'false');
  expect(activeImages).toHaveLength(1);
  expect(activeImages[0].getAttribute('src')).toBe(images[index]);
  expect(activeImages[0].alt).toBe(localized.titles[index]);
  expect(hero().querySelectorAll('img.digzoom-hero-drift')).toHaveLength(1);
  expect(activeImages[0].classList.contains('digzoom-hero-drift')).toBe(true);
  expect(hero().querySelector('h1')?.textContent).toContain(localized.titles[index]);
  expect(hero().querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1);
  expect(button(`${localized.slide} ${index + 1}`).getAttribute('aria-pressed')).toBe('true');
  heroImages.filter(image => image !== activeImages[0]).forEach(image => {
    expect(image.parentElement?.classList.contains('pointer-events-none')).toBe(true);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' && state.reducedMotion,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
  state.lang = 'en';
  state.reducedMotion = false;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('home hero carousel', () => {
  it.each(['en', 'ar'] as const)('selects exactly one image with the correct copy and CTA in %s', async lang => {
    state.lang = lang;
    const localized = copy[lang];
    await render();
    expect(hero().getAttribute('aria-label')).toBe(localized.carousel);

    for (const index of [0, 1, 2, 0, 2]) {
      await click(button(`${localized.slide} ${index + 1}`));
      expectSlide(index);
      expect(link(localized.ctas[index]).getAttribute('href')).toBe(['/#departments', '/marketing', '/partners'][index]);
      expect(hero().querySelectorAll('a')).toHaveLength(index === 0 ? 1 : 2);
      if (index !== 0) expect(link(localized.shop).getAttribute('href')).toBe('/shop');
    }
  });

  it.each(['en', 'ar'] as const)('scrolls to departments and follows service, partner, and store CTAs in %s', async lang => {
    state.lang = lang;
    const localized = copy[lang];
    await render();
    const departments = container.querySelector<HTMLElement>('#departments')!;
    departments.scrollIntoView = vi.fn();
    await click(link(localized.ctas[0]));
    expect(departments.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(container.querySelector('[data-testid="location"]')?.textContent).toBe('/');

    await click(button(`${localized.slide} 2`));
    await click(link(localized.ctas[1]));
    expect(container.querySelector('[data-testid="location"]')?.textContent).toBe('/marketing');
    await click(button(`${localized.slide} 3`));
    await click(link(localized.ctas[2]));
    expect(container.querySelector('[data-testid="location"]')?.textContent).toBe('/partners');
    await click(link(localized.shop));
    expect(container.querySelector('[data-testid="location"]')?.textContent).toBe('/shop');
    expect(departments.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('updates the selected slide and control labels when the language changes', async () => {
    await render();
    await click(button('Slide 2'));
    await click(button(copy.en.pause));
    state.lang = 'ar';
    await render();
    expectSlide(1);
    expect(link(copy.ar.ctas[1]).getAttribute('href')).toBe('/marketing');
    expect(button(copy.ar.play)).toBeDefined();
    expect(hero().textContent).not.toContain(copy.en.titles[1]);
    await advance(12000);
    expectSlide(1);
  });

  it('advances after six seconds, wraps, and resets the timer after manual selection', async () => {
    await render();
    await advance(5999);
    expectSlide(0);
    await advance(1);
    expectSlide(1);
    await advance();
    expectSlide(2);
    await advance();
    expectSlide(0);
    await advance(4000);
    await click(button('Slide 3'));
    await advance(2000);
    expectSlide(2);
    await advance(4000);
    expectSlide(0);
  });

  it.each(['en', 'ar'] as const)('keeps manual pause through hover changes and resumes on play in %s', async lang => {
    state.lang = lang;
    await render();
    await click(button(copy[lang].pause));
    await hover(true);
    await hover(false);
    expect(hero().querySelector('img.digzoom-hero-drift')?.getAttribute('style')).toContain('animation-play-state: paused');
    await advance(18000);
    expectSlide(0);
    await click(button(copy[lang].play));
    expect(hero().querySelector('img.digzoom-hero-drift')?.getAttribute('style')).toContain('animation-play-state: running');
    await advance();
    expectSlide(1);
  });

  it('pauses while hovered and starts a fresh countdown when the pointer leaves', async () => {
    await render();
    await advance(3000);
    await hover(true);
    await advance(12000);
    expectSlide(0);
    await hover(false);
    await advance(5999);
    expectSlide(0);
    await advance(1);
    expectSlide(1);
  });

  it('pauses while keyboard focus moves between native controls and resumes after focus leaves', async () => {
    await render();
    const firstControl = button('Slide 1');
    const nextControl = button('Slide 2');
    expect(firstControl.tabIndex).toBe(0);
    expect(nextControl.tabIndex).toBe(0);
    await act(async () => firstControl.focus());
    expect(document.activeElement).toBe(firstControl);
    await advance(12000);
    expectSlide(0);
    await act(async () => nextControl.focus());
    await click(nextControl);
    await advance(12000);
    expectSlide(1);
    const outsideLink = container.querySelector<HTMLAnchorElement>('#departments a')!;
    await act(async () => outsideLink.focus());
    expect(document.activeElement).toBe(outsideLink);
    await advance();
    expectSlide(2);
  });

  it('disables automatic rotation with reduced motion while preserving manual navigation', async () => {
    state.reducedMotion = true;
    await render();
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    await advance(18000);
    expectSlide(0);
    await click(button('Slide 3'));
    expectSlide(2);
    await click(button(copy.en.pause));
    await click(button(copy.en.play));
    await advance(18000);
    expectSlide(2);
  });

  it.each(['focus', 'hover'] as const)('keeps autoplay paused while %s remains active after the other pause ends', async remaining => {
    await render();
    const outsideLink = container.querySelector<HTMLAnchorElement>('#departments a')!;
    await act(async () => button('Slide 1').focus());
    await hover(true);
    if (remaining === 'focus') await hover(false);
    else await act(async () => outsideLink.focus());
    await advance();
    expectSlide(0);

    if (remaining === 'focus') await act(async () => outsideLink.focus());
    else await hover(false);
    await advance();
    expectSlide(1);
  });

  it('keeps a single light mobile surface, with darker slide colors scoped to desktop', async () => {
    await render();
    for (const index of [0, 1, 2]) {
      await click(button(`Slide ${index + 1}`));
      // This protects the responsive class contract, not browser layout or computed contrast.
      const surface = hero().firstElementChild!;
      expect(surface.classList.contains('bg-[#f7f4ff]')).toBe(true);
      expect(surface.classList.contains('text-slate-950')).toBe(true);
      expect(surface.classList.contains('bg-[#11132d]')).toBe(false);
      expect(surface.classList.contains('text-white')).toBe(false);
      if (index !== 0) {
        expect(surface.classList.contains('md:bg-[#11132d]')).toBe(true);
        expect(surface.classList.contains('md:text-white')).toBe(true);
      }
    }
  });
});
