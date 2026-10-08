import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lockup } from './Mark.jsx';
import { Button } from './Button.jsx';
import { CloseIcon, MenuIcon } from './Icons.jsx';
import { NAV_LINKS } from '../config/site.js';
import { useScreening } from '../hooks/useScreening.jsx';
import { describeScreening } from '../utils/screening.js';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const { phase, screening } = useScreening();
  const canBook = phase === 'ready' && describeScreening(screening).canBook;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const isActive = (to) => pathname === to || (to === '/next-screening' && pathname.startsWith('/screening/'));

  return (
    <header className={`header ${scrolled || open ? 'header--solid' : ''}`}>
      <div className="container header__bar">
        <Link to="/" className="header__brand" aria-label="Mandjara Cinosh — home">
          <Lockup />
        </Link>

        <nav className="header__nav" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="header__link" aria-current={isActive(l.to) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          {canBook ? <Button to="/ticket" size="sm" className="header__cta">Get your ticket</Button> : null}
          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} aria-current={isActive(l.to) ? 'page' : undefined}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {canBook ? <Button to="/ticket" block arrow>Get your ticket</Button> : null}
      </div>
    </header>
  );
}
