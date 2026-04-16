import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import './OrderHistory.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(p));

const STATUS_COLORS = {
  confirmed: '#007600',
  processing: '#c47600',
  shipped: '#0066c0',
  delivered: '#007600',
  cancelled: '#b12704',
  pending: '#555',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <div className="order-history-header">
          <h1>Your Orders</h1>
          <div className="order-history-tabs">
            <button className="order-tab active">Orders</button>
            <button className="order-tab">Buy Again</button>
            <button className="order-tab">Not Yet Shipped</button>
            <button className="order-tab">Cancelled Orders</button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className="orders-shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <>
            <p className="order-count">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header">
                    <div className="order-header-col">
                      <span className="order-header-label">ORDER PLACED</span>
                      <span className="order-header-value">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="order-header-col">
                      <span className="order-header-label">TOTAL</span>
                      <span className="order-header-value">{formatPrice(order.total_amount)}</span>
                    </div>
                    <div className="order-header-col">
                      <span className="order-header-label">SHIP TO</span>
                      <span className="order-header-value order-ship-to">{order.full_name || 'John Doe'}</span>
                    </div>
                    <div className="order-header-col order-header-id">
                      <span className="order-header-label">ORDER # {order.order_number}</span>
                      <Link to={`/order-confirmation/${order.id}`} className="order-detail-link">
                        View order details
                      </Link>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="order-card-body">
                    {/* Status */}
                    <div className="order-status-section">
                      <p className="order-status" style={{ color: STATUS_COLORS[order.status] || '#555' }}>
                        {order.status === 'confirmed' ? '✅ Order Confirmed' :
                         order.status === 'shipped' ? '🚚 Shipped' :
                         order.status === 'delivered' ? '✅ Delivered' :
                         order.status === 'cancelled' ? '❌ Cancelled' :
                         `📦 ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}
                      </p>
                      {order.estimated_delivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <p className="order-estimated">
                          Estimated delivery: {new Date(order.estimated_delivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="order-items-preview">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="order-item-row">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="order-item-img"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div className="order-item-details">
                            <p className="order-item-name">{item.product_name}</p>
                            <p className="order-item-meta">
                              Qty: {item.quantity} · {formatPrice(item.price)} each
                            </p>
                          </div>
                          <div className="order-item-actions">
                            {item.product_id && (
                              <Link to={`/products/${item.product_id}`} className="order-item-btn">
                                Buy it again
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="order-actions">
                      <Link to={`/order-confirmation/${order.id}`} className="order-action-btn order-action-primary">
                        View Order Details
                      </Link>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button className="order-action-btn order-action-secondary">Track Package</button>
                      )}
                      <button className="order-action-btn order-action-secondary">Return / Replace Items</button>
                      <button className="order-action-btn order-action-secondary">Write a Product Review</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
