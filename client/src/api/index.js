// One function per backend endpoint.
import { http } from './http'

export const productsApi = {
  create: (product) => http('/api/products', { method: 'POST', body: product }),
  get: (id) => http(`/api/products/${encodeURIComponent(id)}`),
  list: () => http('/api/products'),
  byCategory: (category) => http(`/api/products?category=${encodeURIComponent(category)}`),
}

export const customersApi = {
  create: (customer) => http('/api/customers', { method: 'POST', body: customer }),
  list: () => http('/api/customers'),
  get: (id) => http(`/api/customers/${id}`),
  orders: (id) => http(`/api/customers/${id}/orders`),
}

export const ordersApi = {
  list: () => http('/api/orders'),
  create: (order) => http('/api/orders', { method: 'POST', body: order }),
  details: (id) => http(`/api/orders/${id}`),
}
