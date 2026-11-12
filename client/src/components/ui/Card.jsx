export default function Card({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <header className="card__head">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
