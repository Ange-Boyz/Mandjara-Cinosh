// The Mandjara mark: two arms rising to meet at one point of light, over a
// filmstrip road. Geometry is taken verbatim from the brand SVG; colour comes
// from CSS `color` so it works on every approved background.
const TICKS = [46, 70, 94, 140, 164, 188];

export function Mark({ className = '', title }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 234"
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d="M28,214 Q58,88 118,52" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
      <path d="M212,214 Q182,88 122,52" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
      <circle cx="120" cy="50" r="15" fill="currentColor" />
      <rect x="34" y="206" width="172" height="18" rx="4" fill="currentColor" />
      {TICKS.map((x) => (
        <rect key={x} x={x} y="196" width="6" height="11" fill="currentColor" />
      ))}
    </svg>
  );
}

export function Lockup({ className = '' }) {
  return (
    <span className={`lockup ${className}`}>
      <Mark className="lockup__mark" />
      <span className="lockup__text">
        <span className="lockup__wm">MANDJARA</span>
        <span className="lockup__sm">CINOSH</span>
      </span>
    </span>
  );
}
