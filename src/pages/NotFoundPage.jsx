import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Mark } from '../components/Mark.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <section className="container state">
      <Mark className="state__mark" />
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="state__title">This road leads nowhere — yet.</h1>
      <p className="lede">The page you are looking for does not exist or has moved.</p>
      <div className="cta-row">
        <Button to="/" arrow>Back to Mandjara</Button>
        <Button to="/next-screening" variant="secondary">The next screening</Button>
      </div>
    </section>
  );
}
