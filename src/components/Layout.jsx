import { Suspense, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { StickyCta } from './StickyCta.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { isMockBackend } from '../services/api.js';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const mainRef = useRef(null);
  const first = useRef(true);

  // On navigation: honour in-page anchors, otherwise start at the top and move
  // focus to <main> so keyboard and screen-reader users land in the new page.
  useLayoutEffect(() => {
    if (hash && !hash.includes('=')) {
      try {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          el.scrollIntoView();
          return;
        }
      } catch {
        /* malformed hash: fall through */
      }
    }
    window.scrollTo(0, 0);
    if (!first.current) mainRef.current?.focus({ preventScroll: true });
    first.current = false;
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); mainRef.current?.scrollIntoView(); }}>
        Skip to content
      </a>
      {isMockBackend ? (
        <div className="demo-banner" role="note">
          Demo mode — sample screening data from the built-in mock backend. Not live.
        </div>
      ) : null}
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="main">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<div className="route-fallback" role="status"><span className="sr-only">Loading…</span></div>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
