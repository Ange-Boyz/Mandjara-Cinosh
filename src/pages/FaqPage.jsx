import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { FAQ } from '../config/site.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function FaqPage() {
  useDocumentTitle('FAQ');
  return (
    <>
      <section className="page-hero page-hero--left">
        <div className="container">
          <Eyebrow>Questions</Eyebrow>
          <h1 className="page-hero__title">Frequently asked.</h1>
          <p className="lede">Everything about tickets, the evening and how Mandjara works.</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container container--narrow">
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  <span>{item.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <div className="faq__more">
            <p className="lede">Still have a question?</p>
            <Button to="/contact" variant="secondary" arrow>Contact us</Button>
          </div>
        </div>
      </section>
    </>
  );
}
