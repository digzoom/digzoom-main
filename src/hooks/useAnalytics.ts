// Google Analytics 4 tracking hook
const GA_ID = import.meta.env.VITE_GA_ID || '';

export function initGA() {
  if (!GA_ID || typeof window === 'undefined') return;
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { page_title: document.title, send_page_view: true });
}

export function trackPageView(path: string) {
  if (!window.gtag || !GA_ID) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!window.gtag || !GA_ID) return;
  window.gtag('event', eventName, params || {});
}

export function trackPurchase(transactionId: string, value: number, currency: string = 'SAR') {
  if (!window.gtag || !GA_ID) return;
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency,
  });
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
