import { useId } from 'react'

export default function Field({ label, hint, ...inputProps }) {
  const id = useId()
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <input id={id} className="input" {...inputProps} />
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  )
}
