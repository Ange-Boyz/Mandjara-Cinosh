export function QuantityStepper({ id, value, min = 1, max, onChange, label = 'Number of tickets', error }) {
  return (
    <div className="stepper-wrap">
      <div className="stepper" role="group" aria-labelledby={`${id}-label`}>
        <span id={`${id}-label`} className="sr-only">{label}</span>
        <button type="button" className="stepper__btn" aria-label="Remove one ticket" disabled={value <= min} onClick={() => onChange(value - 1)}>
          <span aria-hidden="true">−</span>
        </button>
        <output id={id} className="stepper__value" aria-live="polite" tabIndex={-1}>{value}</output>
        <button type="button" className="stepper__btn" aria-label="Add one ticket" disabled={value >= max} onClick={() => onChange(value + 1)}>
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {error ? <p className="field__error" role="alert">{error}</p> : null}
    </div>
  );
}
