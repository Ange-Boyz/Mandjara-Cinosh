import { useState } from 'react';
import { Button } from '../Button.jsx';
import { Eyebrow } from '../Eyebrow.jsx';
import { Field } from '../Field.jsx';
import { CheckIcon } from '../Icons.jsx';
import { VOTE_THEMES } from '../../config/site.js';
import { api } from '../../services/api.js';
import { cleanText } from '../../utils/validators.js';
import { local } from '../../utils/storage.js';
import { safeHttpsUrl } from '../../utils/url.js';

// "Keep the memory": photos, feedback and the vote for what comes next.
// The browser flag below is only a courtesy to avoid double-posting; the
// server is what enforces one vote / one feedback per person.

function Photos({ photos }) {
  const safe = (photos || [])
    .map((p) => ({ url: safeHttpsUrl(p?.url), alt: cleanText(p?.alt || 'Photo from the screening', 160) }))
    .filter((p) => p.url)
    .slice(0, 8);
  if (!safe.length) {
    return <p className="muted">Photos from the evening will be shared here soon.</p>;
  }
  return (
    <ul className="photos">
      {safe.map((p) => (
        <li key={p.url}>
          <img src={p.url} alt={p.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        </li>
      ))}
    </ul>
  );
}

function Feedback({ screeningId }) {
  const flag = `mj_fb_${screeningId}`;
  const [done, setDone] = useState(() => local.get(flag) === '1');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    if (!rating) return setError('Please choose a rating from 1 to 5.');
    setBusy(true);
    setError('');
    try {
      await api.submitFeedback({ screeningId, rating, comment: cleanText(comment, 1000), wouldReturn: again === 'yes' ? true : again === 'no' ? false : null });
      local.set(flag, '1');
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not send your feedback.');
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p className="thanks"><CheckIcon /> Thank you — your words help shape the next evening.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="stack">
      <fieldset className="plain">
        <legend className="label">How was the evening?</legend>
        <div className="rating" role="radiogroup" aria-label="Rating from 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} out of 5`}
              className={`rating__btn ${rating >= n ? 'is-on' : ''}`}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <Field
        id="fb-comment"
        as="textarea"
        rows={4}
        maxLength={1000}
        label="What did the film make you think about?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <fieldset className="plain">
        <legend className="label">Would you attend another Mandjara screening?</legend>
        <div className="choice-row">
          {['yes', 'no'].map((v) => (
            <label key={v} className="choice">
              <input type="radio" name="again" value={v} checked={again === v} onChange={() => setAgain(v)} />
              <span>{v === 'yes' ? 'Yes, definitely' : 'Not sure yet'}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <p className="field__error" role="alert">{error}</p> : null}
      <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send my thoughts'}</Button>
    </form>
  );
}

function Vote({ screeningId }) {
  const flag = `mj_vote_${screeningId}`;
  const [done, setDone] = useState(() => local.get(flag) === '1');
  const [theme, setTheme] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    if (!VOTE_THEMES.includes(theme)) return setError('Choose a theme to vote.');
    setBusy(true);
    setError('');
    try {
      await api.submitVote({ screeningId, theme });
      local.set(flag, '1');
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not record your vote.');
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p className="thanks"><CheckIcon /> Vote received. We will announce the next theme soon.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="stack">
      <fieldset className="plain">
        <legend className="label">Which theme should we explore next?</legend>
        <div className="choice-col">
          {VOTE_THEMES.map((t) => (
            <label key={t} className="choice">
              <input type="radio" name="theme" value={t} checked={theme === t} onChange={() => setTheme(t)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <p className="field__error" role="alert">{error}</p> : null}
      <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Cast my vote'}</Button>
    </form>
  );
}

export function Memory({ screening }) {
  return (
    <section className="section section--leaf" id="memory" aria-labelledby="mem-title">
      <div className="container">
        <div className="section__head">
          <Eyebrow>Keep the memory</Eyebrow>
          <h2 id="mem-title" className="h2">Last evening at Mandjara.</h2>
        </div>
        <div className="memory__photos">
          <h3 className="label">Photos</h3>
          <Photos photos={screening.photos} />
        </div>
        <div className="memory__forms">
          <div>
            <h3 className="memory__h">What did you think?</h3>
            <Feedback screeningId={screening.id} />
          </div>
          <div>
            <h3 className="memory__h">Vote for what is next.</h3>
            <Vote screeningId={screening.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
