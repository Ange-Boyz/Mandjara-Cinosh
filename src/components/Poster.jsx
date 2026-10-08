import { useState } from 'react';
import { Mark } from './Mark.jsx';
import { safeHttpsUrl } from '../utils/url.js';
import { formatShortDate, formatTime, formatFCFA } from '../utils/format.js';

// Shows the real poster when the API provides one (https only). Otherwise a
// designed key-art fallback built from the brand, so the page never looks empty.
export function Poster({ screening, priority = false }) {
  const url = safeHttpsUrl(screening.posterUrl);
  const [failed, setFailed] = useState(false);

  if (url && !failed) {
    return (
      <div className="poster poster--image">
        <img
          src={url}
          alt={`Poster for ${screening.title}`}
          width="800"
          height="1200"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="poster poster--art" role="img" aria-label={`Artwork for ${screening.title}`}>
      <span className="poster__tag">Mandjara Cinosh</span>
      <Mark className="poster__mark" />
      <div className="poster__bottom">
        <span className="poster__title">{screening.title}</span>
        <span className="poster__meta">
          {formatShortDate(screening.startsAt)} · {formatTime(screening.startsAt)}
          <br />
          {formatFCFA(screening.ticketPrice)}
        </span>
      </div>
    </div>
  );
}
