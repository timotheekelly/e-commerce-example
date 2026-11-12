import { useEffect, useState } from 'react'
import PageIntro from '../../components/PageIntro'
import Card from '../../components/ui/Card'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import DataTable from '../../components/ui/DataTable'
import { useAsync } from '../../hooks/useAsync'
import { useLoad } from '../../hooks/useLoad'
import { ordersApi } from '../../api'
import { formatMoney } from '../../lib/format'

function CreateOrder({ prefill, onCreated }) {
  const [form, setForm] = useState({ customerId: '', productId: '', quantity: '1' })
  const { data, error, loading, run } = useAsync(ordersApi.create)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Accept IDs pushed from the Products / Customers pages.
  useEffect(() => {
    setForm((f) => ({
      ...f,
      customerId: prefill.customerId ?? f.customerId,
      productId: prefill.productId ?? f.productId,
    }))
  }, [prefill])

  async function submit(e) {
    e.preventDefault()
    const o = await run({ customerId: Number(form.customerId), productId: form.productId.trim(), quantity: Number(form.quantity) })
    if (o) onCreated()
  }

  return (
    <Card title="Place an order" subtitle="Links a PostgreSQL customer to a MongoDB product.">
      <form className="stack" onSubmit={submit}>
        <div className="row">
          <Field label="Customer ID" type="number" min="1" value={form.customerId} onChange={set('customerId')} required placeholder="1" />
          <Field label="Product ID" value={form.productId} onChange={set('productId')} required placeholder="65f1…" />
          <Field label="Quantity" type="number" min="1" value={form.quantity} onChange={set('quantity')} required />
          <Button disabled={loading}>{loading ? 'Placing…' : 'Place order'}</Button>
        </div>
        <Notice kind="error">{error}</Notice>
        {data && <Notice kind="success">Order <strong>#{data.id}</strong> created.</Notice>}
      </form>
    </Card>
  )
}

const columns = [
  { key: 'orderId', header: 'Order' , render: (o) => `#${o.orderId}` },
  { key: 'customer', header: 'Customer', render: (o) => o.customer?.name },
  { key: 'product', header: 'Product', render: (o) => (
    <>{o.product?.name} <span className="badge badge--muted">{o.product?.category}</span></>
  ) },
  { key: 'quantity', header: 'Qty', align: 'right' },
  { key: 'unitPrice', header: 'Unit price', align: 'right', render: (o) => formatMoney(o.unitPrice) },
  { key: 'total', header: 'Total', align: 'right', render: (o) => <strong>{formatMoney(o.total)}</strong> },
]

export default function OrdersPage({ prefill }) {
  const orders = useLoad(ordersApi.list)
  return (
    <>
      <PageIntro title="Orders">Each order row in PostgreSQL references a customer and a MongoDB product by ID.</PageIntro>
      <div className="section-head">
        <h2>All orders <span className="badge badge--muted">{orders.data?.length ?? 0}</span></h2>
        <Button variant="secondary" size="sm" onClick={orders.reload}>Refresh</Button>
      </div>
      <Notice kind="error">{orders.error}</Notice>
      <DataTable columns={columns} rows={orders.data} rowKey="orderId" empty={orders.loading ? 'Loading…' : 'No orders yet.'} />
      <CreateOrder prefill={prefill} onCreated={orders.reload} />
    </>
  )
}
