// items: [[label, value], ...]
export default function KeyValue({ items, className = '' }) {
  return (
    <dl className={`kv ${className}`}>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
