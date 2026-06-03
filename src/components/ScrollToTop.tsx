import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop — scrolls window to top on every route change.
 * Works with HashRouter. Preserves anchor links (#hash) within same page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top on pathname change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
