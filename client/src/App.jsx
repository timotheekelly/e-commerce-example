import { useState } from 'react'
import Header from './components/Header'
import ProductsPage from './features/products/ProductsPage'
import CustomersPage from './features/customers/CustomersPage'
import OrdersPage from './features/orders/OrdersPage'

const TABS = [
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
  { id: 'orders', label: 'Orders' },
]

export default function App() {
  const [tab, setTab] = useState('products')
  // IDs handed from one page to the order form.
  const [prefill, setPrefill] = useState({})

  const goToOrder = (patch) => { setPrefill({ ...patch }); setTab('orders') }

  return (
    <>
      <Header tabs={TABS} active={tab} onChange={setTab} />
      <main className="page">
        {tab === 'products' && <ProductsPage onOrderProduct={(productId) => goToOrder({ productId })} />}
        {tab === 'customers' && <CustomersPage onOrderCustomer={(customerId) => goToOrder({ customerId })} />}
        {tab === 'orders' && <OrdersPage prefill={prefill} />}
      </main>
    </>
  )
}
