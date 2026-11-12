const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const formatMoney = (n) => (n == null ? '—' : money.format(n))

// Renders any MongoDB attribute value (string, number, boolean, array, nested object) as text.
export function formatValue(v) {
  if (v == null) return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.map(formatValue).join(', ')
  if (typeof v === 'object') return Object.entries(v).map(([k, x]) => `${k}: ${formatValue(x)}`).join(' · ')
  return String(v)
}
