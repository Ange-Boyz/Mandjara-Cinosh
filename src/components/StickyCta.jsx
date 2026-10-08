import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './Button.jsx';
import { useScreening } from '../hooks/useScreening.jsx';
import { describeScreening } from '../utils/screening.js';
import { formatFCFA } from '../utils/format.js';

// Mobile-only booking bar: the main action stays one thumb-tap away while the
// visitor scrolls the story. Appears after the hero, hidden on booking pages.
const SHOW_ON = (p) => p === '/' || p === '/next-screening' || p.startsWith('/screening/');

export function StickyCta() {
  const { pathname } = useLocation();
  const { phase, screening } = useScreening();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const enabled = SHOW_ON(pathname) && phase === 'ready' && describeScreening(screening).canBook;

  useEffect(() => {
    document.body.classList.toggle('has-sticky-cta', enabled);
    return () => document.body.classList.remove('has-sticky-cta');
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`sticky-cta ${past ? 'is-visible' : ''}`}>
      <div className="sticky-cta__info">
        <span className="sticky-cta__price">{formatFCFA(screening.ticketPrice)}</span>
        <span className="sticky-cta__sub">per ticket</span>
      </div>
      <Button to="/ticket" arrow tabIndex={past ? 0 : -1}>Get your ticket</Button>
    </div>
  );
}
