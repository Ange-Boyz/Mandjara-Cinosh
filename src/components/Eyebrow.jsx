export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="eyebrow__dash" aria-hidden="true" />
      {children}
    </p>
  );
}
