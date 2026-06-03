import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop — scrolls window to top on every route change.
 * Works with HashRouter without breaking anchor links inside the same page.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash anchor (e.g. #section), don't scroll to top —
    // let the browser handle the anchor jump.
    if (hash) return;

    // Scroll to top smoothly on pathname change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}
