export default function PageIntro({ title, children }) {
  return (
    <div className="page__intro">
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  )
}
