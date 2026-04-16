import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Products
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Cart
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (product_id, quantity = 1) => api.post('/cart/items', { product_id, quantity }),
  updateItem: (itemId, quantity) => api.patch(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Orders
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
};

// Wishlist
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (product_id) => api.post('/wishlist/toggle', { product_id }),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

export default api;
