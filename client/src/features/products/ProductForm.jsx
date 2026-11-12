import { useState } from 'react'
import Card from '../../components/ui/Card'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import { useAsync } from '../../hooks/useAsync'
import { productsApi } from '../../api'

const empty = { name: '', category: '', price: '' }

// Converts "true"/"42" strings to proper JSON types so Mongo stores useful values.
const coerce = (v) => {
  if (v === 'true') return true
  if (v === 'false') return false
  return v.trim() !== '' && !isNaN(Number(v)) ? Number(v) : v
}

export default function ProductForm({ onCreated }) {
  const [form, setForm] = useState(empty)
  const [attrs, setAttrs] = useState([{ key: '', value: '' }])
  const { error, loading, run } = useAsync(productsApi.create)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setAttr = (i, field) => (e) =>
    setAttrs(attrs.map((a, j) => (j === i ? { ...a, [field]: e.target.value } : a)))

  async function submit(e) {
    e.preventDefault()
    const attributes = Object.fromEntries(
      attrs.filter((a) => a.key.trim()).map((a) => [a.key.trim(), coerce(a.value)]),
    )
    const created = await run({ ...form, price: Number(form.price), attributes })
    if (created) {
      setForm(empty)
      setAttrs([{ key: '', value: '' }])
      onCreated(created)
    }
  }

  return (
    <Card title="Add a product" subtitle="Stored in MongoDB — attributes can be anything.">
      <form className="stack" onSubmit={submit}>
        <Field label="Name" value={form.name} onChange={set('name')} required placeholder="Trail Running Shoes" />
        <div className="row">
          <Field label="Category" value={form.category} onChange={set('category')} required placeholder="footwear" />
          <Field label="Price (USD)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required placeholder="89.99" />
        </div>
        <hr className="divider" />
        <div className="stack" style={{ gap: 8 }}>
          <span className="field__label">Attributes</span>
          {attrs.map((a, i) => (
            <div className="attr-row" key={i}>
              <input className="input" aria-label="Attribute name" placeholder="color" value={a.key} onChange={setAttr(i, 'key')} />
              <input className="input" aria-label="Attribute value" placeholder="blue" value={a.value} onChange={setAttr(i, 'value')} />
              <Button type="button" variant="ghost" size="sm" aria-label="Remove attribute"
                onClick={() => setAttrs(attrs.length > 1 ? attrs.filter((_, j) => j !== i) : [{ key: '', value: '' }])}>✕</Button>
            </div>
          ))}
          <div><Button type="button" variant="ghost" size="sm" onClick={() => setAttrs([...attrs, { key: '', value: '' }])}>+ Add attribute</Button></div>
        </div>
        <Notice kind="error">{error}</Notice>
        <Button disabled={loading}>{loading ? 'Saving…' : 'Create product'}</Button>
      </form>
    </Card>
  )
}
