import { useCountdown } from '../hooks/useCountdown.js';

const pad = (n) => String(n).padStart(2, '0');

export function Countdown({ target, label = 'The screening starts in' }) {
  const t = useCountdown(target);
  if (t.done) return null;
  const units = [
    ['Days', t.days],
    ['Hours', t.hours],
    ['Minutes', t.minutes],
    ['Seconds', t.seconds],
  ];
  return (
    <div className="countdown">
      <p className="countdown__label">{label}</p>
      {/* Visual digits tick every second; screen readers get a calm, static summary. */}
      <p className="sr-only">{`${t.days} days, ${t.hours} hours and ${t.minutes} minutes`}</p>
      <div className="countdown__units" aria-hidden="true">
        {units.map(([cap, value]) => (
          <div className="countdown__unit" key={cap}>
            <span className="countdown__num">{pad(value)}</span>
            <span className="countdown__cap">{cap}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
