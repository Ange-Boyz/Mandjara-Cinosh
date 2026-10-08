// Accessible form field: label, hint and error are wired with ARIA.
export function Field({ id, label, error, hint, prefix, as: Tag = 'input', className = '', ...props }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  const control = (
    <Tag id={id} className="input" aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy} {...props} />
  );
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {prefix ? (
        <div className="input-group">
          <span className="input-group__prefix" aria-hidden="true">{prefix}</span>
          {control}
        </div>
      ) : (
        control
      )}
      {hint ? <p id={`${id}-hint`} className="field__hint">{hint}</p> : null}
      {error ? <p id={`${id}-err`} className="field__error" role="alert">{error}</p> : null}
    </div>
  );
}
