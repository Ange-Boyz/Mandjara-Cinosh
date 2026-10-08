import { Eyebrow } from '../components/Eyebrow.jsx';
import { SITE } from '../config/site.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Plain-language privacy notice. This is a sound starting draft, but it must be
// reviewed by legal counsel against Cameroonian data-protection law before launch.
export default function PrivacyPage() {
  useDocumentTitle('Privacy notice');
  return (
    <>
      <section className="page-hero page-hero--left">
        <div className="container">
          <Eyebrow>Privacy</Eyebrow>
          <h1 className="page-hero__title">How we handle your details.</h1>
          <p className="lede">Short version: we ask for what we need to get you into the room, and nothing more.</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container container--narrow prose">
          <h2 className="h3">What we collect</h2>
          <p>
            When you book: your full name, phone number, email address, how many tickets you want, and the status of your payment.
            When you write to us or share feedback: the message, rating or vote you send.
          </p>
          <p>
            We never see or store your Mobile Money PIN or card details. Those go straight to the payment provider.
          </p>

          <h2 className="h3">Why we collect it</h2>
          <p>
            To confirm your booking, issue your QR ticket, send a reminder before the evening, admit you at the door,
            refund you if a screening is cancelled, and answer your messages. We may also share anonymised, aggregated
            audience insight, such as which themes people prefer. That never includes names, numbers or emails.
          </p>

          <h2 className="h3">Who can see it</h2>
          <p>
            The Mandjara team, and the service providers that process payments and send email for us. We do not sell personal data.
          </p>

          <h2 className="h3">On your device</h2>
          <p>
            Your browser keeps a private access key and a copy of your ticket so it reopens quickly, even on a weak connection.
            Anyone who has your private ticket link can see your QR code, so keep it to yourself.
          </p>

          <h2 className="h3">How long we keep it</h2>
          <p>
            Only as long as we need it to run the event, handle refunds and meet our legal duties.
          </p>

          <h2 className="h3">Your choices</h2>
          <p>
            You can ask to see, correct or delete your details at any time by writing to{' '}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
          <p className="muted">Last updated 7 October 2026.</p>
        </div>
      </section>
    </>
  );
}
