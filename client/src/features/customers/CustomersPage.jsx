import { useState } from 'react'
import PageIntro from '../../components/PageIntro'
import Card from '../../components/ui/Card'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import DataTable from '../../components/ui/DataTable'
import { useAsync } from '../../hooks/useAsync'
import { useLoad } from '../../hooks/useLoad'
import { customersApi, ordersApi } from '../../api'

function CreateCustomer({ onCreated }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const { data, error, loading, run } = useAsync(customersApi.create)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    const c = await run(form)
    if (c) { setForm({ name: '', email: '' }); onCreated() }
  }

  return (
    <Card title="Add a customer" subtitle="Stored in PostgreSQL.">
      <form className="stack" onSubmit={submit}>
        <div className="row">
          <Field label="Name" value={form.name} onChange={set('name')} required placeholder="Ada Lovelace" />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="ada@example.com" />
          <Button disabled={loading}>{loading ? 'Saving…' : 'Create customer'}</Button>
        </div>
        <Notice kind="error">{error}</Notice>
        {data && <Notice kind="success">Created customer <strong>#{data.id}</strong> ({data.name}).</Notice>}
      </form>
    </Card>
  )
}

export default function CustomersPage({ onOrderCustomer }) {
  const customers = useLoad(customersApi.list)
  const orders = useLoad(ordersApi.list)

  // Order counts per customer, derived from the orders table.
  const counts = {}
  ;(orders.data || []).forEach((o) => { counts[o.customer?.id] = (counts[o.customer?.id] || 0) + 1 })

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'orders', header: 'Orders', align: 'right', render: (c) => counts[c.id] || 0 },
    { key: 'actions', header: '', align: 'right', render: (c) => (
      <Button variant="ghost" size="sm" onClick={() => onOrderCustomer(c.id)}>New order →</Button>
    ) },
  ]

  return (
    <>
      <PageIntro title="Customers">Uniform, relational records — a natural fit for PostgreSQL tables.</PageIntro>
      <div className="section-head">
        <h2>All customers <span className="badge badge--muted">{customers.data?.length ?? 0}</span></h2>
        <Button variant="secondary" size="sm" onClick={() => { customers.reload(); orders.reload() }}>Refresh</Button>
      </div>
      <Notice kind="error">{customers.error}</Notice>
      <DataTable columns={columns} rows={customers.data} empty={customers.loading ? 'Loading…' : 'No customers yet.'} />
      <CreateCustomer onCreated={customers.reload} />
    </>
  )
}
