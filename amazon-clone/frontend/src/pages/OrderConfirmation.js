import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import './OrderConfirmation.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(p));

const OrderConfirmation = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);

  useEffect(() => {
    if (!order) {
      orderAPI.getById(id)
        .then(({ data }) => setOrder(data))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!order) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2>Order not found</h2>
      <Link to="/orders">View all orders</Link>
    </div>
  );

  const estimatedDate = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Within 5 business days';

  return (
    <div className="order-confirm-page">
      <div className="order-confirm-container">
        {/* Success Header */}
        <div className="order-confirm-header">
          <div className="confirm-checkmark">✓</div>
          <div>
            <h1>Order Placed, Thank you!</h1>
            <p>Confirmation will be sent to <strong>john@example.com</strong></p>
          </div>
        </div>

        {/* Order Details */}
        <div className="order-confirm-body">
          <div className="order-confirm-main">
            {/* Delivery Info */}
            <div className="confirm-card">
              <h3>📦 Estimated Delivery</h3>
              <p className="delivery-date">{estimatedDate}</p>
              <p className="text-secondary">Your order is being processed and will be shipped soon.</p>
            </div>

            {/* Order Summary */}
            <div className="confirm-card">
              <div className="confirm-order-id">
                <h3>Order Details</h3>
                <div className="order-id-display">
                  <span>Order ID: </span>
                  <strong className="text-orange">{order.order_number}</strong>
                </div>
                <p className="text-secondary" style={{ fontSize: 13 }}>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Items */}
              <div className="confirm-items">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="confirm-item">
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_name}
                        onError={e => { e.target.style.display = 'none'; }} />
                    )}
                    <div className="confirm-item-info">
                      <p className="confirm-item-name">{item.product_name}</p>
                      <p className="text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <p className="confirm-item-price">{formatPrice(item.subtotal || item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="confirm-totals">
                <div className="confirm-total-row">
                  <span>Item(s) subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="confirm-total-row">
                  <span>Shipping:</span>
                  <span>{parseFloat(order.shipping_cost) === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="confirm-total-row">
                  <span>GST (18%):</span>
                  <span>{formatPrice(order.tax_amount)}</span>
                </div>
                <div className="confirm-total-row confirm-grand-total">
                  <span>Order Total:</span>
                  <span className="text-red">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.full_name && (
              <div className="confirm-card">
                <h3>📍 Shipping Address</h3>
                <p><strong>{order.full_name}</strong></p>
                <p>{order.address_line1}</p>
                <p>{order.city}, {order.state} - {order.postal_code}</p>
                <p>{order.country}</p>
              </div>
            )}

            {/* Status */}
            <div className="confirm-card confirm-status-track">
              <h3>Order Status</h3>
              <div className="status-track">
                {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((s, i) => (
                  <div key={s} className={`status-step ${i === 0 ? 'active' : ''}`}>
                    <div className="status-dot" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="order-confirm-sidebar">
            <div className="confirm-actions">
              <Link to="/orders" className="confirm-action-btn confirm-action-primary">
                View All Orders
              </Link>
              <Link to="/products" className="confirm-action-btn confirm-action-secondary">
                Continue Shopping
              </Link>
              <button className="confirm-action-btn confirm-action-secondary">
                📄 Print Invoice
              </button>
            </div>

            <div className="confirm-help">
              <h4>Need Help?</h4>
              <p><a href="#">Track your order</a></p>
              <p><a href="#">Return or replace items</a></p>
              <p><a href="#">Contact Amazon.clone</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
