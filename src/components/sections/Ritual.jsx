import { RITUAL } from '../../config/site.js';
import { Reveal } from '../Reveal.jsx';

// The eight moments of the Mandjara ritual. `notes` lets the event page add
// screening-specific detail to a given moment.
export function Ritual({ notes = {} }) {
  return (
    <ol className="ritual">
      {RITUAL.map((r, i) => (
        <Reveal as="li" className="ritual__item" key={r.name} delay={(i % 4) * 60}>
          <span className="ritual__n">{String(i + 1).padStart(2, '0')}</span>
          <div className="ritual__body">
            <h3 className="ritual__t">{r.name}</h3>
            <p>{r.text}</p>
            {notes[r.name] ? <p className="ritual__note">{notes[r.name]}</p> : null}
          </div>
          <span className="ritual__d">{r.duration}</span>
        </Reveal>
      ))}
    </ol>
  );
}
