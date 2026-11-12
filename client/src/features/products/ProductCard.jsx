import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import KeyValue from '../../components/ui/KeyValue'
import { formatMoney, formatValue } from '../../lib/format'

export default function ProductCard({ product, onOrder }) {
  const attrs = Object.entries(product.attributes || {})
  return (
    <Card className="product">
      <span className="badge product__category">{product.category}</span>
      <h3 className="product__name">{product.name}</h3>
      <div className="product__price">{formatMoney(product.price)}</div>
      <KeyValue className="product__attrs" items={attrs.map(([k, v]) => [k, formatValue(v)])} />
      <footer className="product__footer">
        <code className="product__id" title={`Product ID: ${product.id}`}>{product.id}</code>
        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(product.id)}>Copy</Button>
        {onOrder && <Button variant="secondary" size="sm" onClick={() => onOrder(product.id)}>Order</Button>}
      </footer>
    </Card>
  )
}
