import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';

// Google Analytics 4
const GA4_ID = import.meta.env.VITE_GA4_ID || 'G-6JBMFTYHJ9';
// Microsoft Clarity - Replace with your real Project ID
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || 'PLACEHOLDER';

// Initialize GA4
function initGA4() {
  if (typeof window === 'undefined' || GA4_ID === 'G-PLACEHOLDER') return;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA4_ID}', { send_page_view: false });
  `;
  document.head.appendChild(script2);
}

// Track event in GA4
export function trackGA4Event(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag && GA4_ID !== 'G-PLACEHOLDER') {
    (window as any).gtag('event', eventName, params);
  }
}

// Initialize Microsoft Clarity
function initClarity() {
  if (typeof window === 'undefined' || CLARITY_ID === 'PLACEHOLDER') return;

  const script = document.createElement('script');
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");
  `;
  document.head.appendChild(script);
}

export function trackClarityEvent(eventName: string) {
  if (typeof window !== 'undefined' && (window as any).clarity && CLARITY_ID !== 'PLACEHOLDER') {
    (window as any).clarity('event', eventName);
  }
}

// Track page view
function trackPageView(path: string) {
  if (typeof window !== 'undefined' && (window as any).gtag && GA4_ID !== 'G-PLACEHOLDER') {
    (window as any).gtag('config', GA4_ID, { page_path: path });
  }
  if (typeof window !== 'undefined' && (window as any).clarity && CLARITY_ID !== 'PLACEHOLDER') {
    (window as any).clarity('event', `page_${path.replace(/\//g, '_')}`);
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    initGA4();
    initClarity();
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    trackPageView(path);
  }, [location]);

  return <>{children}</>;
}
