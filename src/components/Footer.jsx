import { Link } from 'react-router-dom';
import { Lockup } from './Mark.jsx';
import { NAV_LINKS, SITE } from '../config/site.js';

export function Footer() {
  return (
    <footer className="footer">
      <div className="weave" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Lockup />
          <p className="footer__tagline">“{SITE.tagline}”</p>
          <p className="footer__small">
            In Cameroon, “mandjara” means cousin. One week, one film, one shared experience — everyone welcome.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="footer__h">Explore</h2>
          <ul className="footer__list">
            <li><Link to="/">Home</Link></li>
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
            <li><Link to="/ticket">Get your ticket</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="footer__h">Find us</h2>
          <ul className="footer__list">
            <li>{SITE.city}, {SITE.country}</li>
            <li><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
            <li>{SITE.social}</li>
          </ul>
        </div>
      </div>
      <div className="container footer__legal">
        <span>© {new Date().getFullYear()} Mandjara Cinosh. All rights reserved.</span>
        <span><Link to="/privacy">Privacy notice</Link> · {SITE.city} · {SITE.country}</span>
      </div>
    </footer>
  );
}
