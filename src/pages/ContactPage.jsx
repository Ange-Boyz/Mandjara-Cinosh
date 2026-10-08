import { useRef, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Field } from '../components/Field.jsx';
import { CheckIcon } from '../components/Icons.jsx';
import { SITE } from '../config/site.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { api } from '../services/api.js';
import { cleanText, validateEmail, validateMessage, validateName } from '../utils/validators.js';

const TOPICS = ['General question', 'I am a filmmaker or artist', 'Partnership or sponsorship', 'Press', 'My booking'];

export default function ContactPage() {
  useDocumentTitle('Contact');
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const busyRef = useRef(false);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (busyRef.current) return;
    const errs = {};
    if (validateName(form.name)) errs.name = validateName(form.name);
    if (validateEmail(form.email)) errs.email = validateEmail(form.email);
    if (validateMessage(form.message)) errs.message = validateMessage(form.message);
    setFormError('');
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = ['name', 'email', 'message'].find((k) => errs[k]);
      requestAnimationFrame(() => document.getElementById(`ct-${first}`)?.focus());
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      await api.sendContact({
        name: cleanText(form.name, 80),
        email: cleanText(form.email, 254),
        topic: TOPICS.includes(form.topic) ? form.topic : TOPICS[0],
        message: cleanText(form.message, 2000),
        website: form.website, // honeypot: humans never see or fill this
      });
      setSent(true);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setFormError(err.message || 'Your message could not be sent.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <section className="page-hero page-hero--left">
        <div className="container">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="page-hero__title">Let&rsquo;s talk.</h1>
          <p className="lede">Questions, ideas, collaborations — write to us and we will answer.</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container contact">
          {sent ? (
            <div className="contact__sent" role="status">
              <p className="thanks"><CheckIcon /> Message sent.</p>
              <h2 className="h3">Thank you, we&rsquo;ll be in touch.</h2>
              <p>We usually reply within a few days.</p>
              <Button to="/" variant="secondary" arrow>Back to home</Button>
            </div>
          ) : (
            <form className="contact__form stack" onSubmit={onSubmit} noValidate>
              <Field id="ct-name" label="Your name" autoComplete="name" maxLength={80} value={form.name} onChange={set('name')} error={errors.name} required />
              <Field id="ct-email" label="Email" type="email" inputMode="email" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} error={errors.email} required />
              <Field id="ct-topic" as="select" label="Topic" value={form.topic} onChange={set('topic')}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Field>
              <Field id="ct-message" as="textarea" rows={6} maxLength={2000} label="Message" value={form.message} onChange={set('message')} error={errors.message} required />
              {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="ct-website">Website</label>
                <input id="ct-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </div>
              {formError ? <p className="notice notice--error" role="alert">{formError}</p> : null}
              <Button type="submit" disabled={busy} aria-busy={busy} arrow>{busy ? 'Sending…' : 'Send message'}</Button>
            </form>
          )}

          <aside className="contact__side">
            <h2 className="label">Direct</h2>
            <p><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
            <h2 className="label">Based in</h2>
            <p>{SITE.city}, {SITE.country}</p>
            <h2 className="label">Follow</h2>
            <p>{SITE.social}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
