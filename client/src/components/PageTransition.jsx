import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

/**
 * Wraps page content with a CSS-based fade-in on every route change.
 * No external animation library needed.
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reset by removing the class, then re-adding it on the next frame
    el.classList.remove('page-enter');
    // Trigger reflow
    void el.offsetHeight;
    el.classList.add('page-enter');
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter" style={{ flex: 1 }}>
      {children}
    </div>
  );
}
