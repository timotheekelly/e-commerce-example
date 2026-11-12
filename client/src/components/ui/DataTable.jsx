// columns: [{ key, header, render?(row), align? }]
export default function DataTable({ columns, rows, rowKey = 'id', empty = 'Nothing here yet.' }) {
  if (!rows?.length) return <div className="notice notice--empty">{empty}</div>
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={{ textAlign: c.align }}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[rowKey]}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align }}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
