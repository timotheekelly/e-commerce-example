import { useMemo, useState } from 'react'
import PageIntro from '../../components/PageIntro'
import Notice from '../../components/ui/Notice'
import Button from '../../components/ui/Button'
import { useLoad } from '../../hooks/useLoad'
import { productsApi } from '../../api'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'

export default function ProductsPage({ onOrderProduct }) {
  const { data: products, error, loading, reload } = useLoad(productsApi.list)
  const [category, setCategory] = useState(null)

  const categories = useMemo(() => [...new Set((products || []).map((p) => p.category))].sort(), [products])
  const shown = (products || []).filter((p) => !category || p.category === category)

  return (
    <>
      <PageIntro title="Products">
        Every product lives in one MongoDB collection, yet each category carries its own attributes — no schema changes needed.
      </PageIntro>

      <div className="section-head">
        <h2>Catalog <span className="badge badge--muted">{shown.length}</span></h2>
        <Button variant="secondary" size="sm" onClick={reload} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
      </div>

      <div className="chips" role="group" aria-label="Filter by category">
        <button className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>All</button>
        {categories.map((c) => (
          <button key={c} className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <Notice kind="error">{error}</Notice>
      <div className="grid-cards">
        {shown.map((p) => <ProductCard key={p.id} product={p} onOrder={onOrderProduct} />)}
      </div>
      {!loading && !error && shown.length === 0 && <Notice kind="empty">No products found.</Notice>}

      <ProductForm onCreated={reload} />
    </>
  )
}
