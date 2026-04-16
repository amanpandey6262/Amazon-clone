import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(p));

const Cart = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const { items, subtotal } = cart;

  const shipping = parseFloat(subtotal) >= 499 ? 0 : 40;
  const tax = parseFloat((parseFloat(subtotal) * 0.18).toFixed(2));
  const total = parseFloat(subtotal) + shipping + tax;

  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <img src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB424694257_.svg" alt="Empty cart" style={{ width: 200, opacity: 0.6 }} />
          <h2>Your Amazon.clone Cart is empty</h2>
          <p>Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics, and more.</p>
          <Link to="/products" className="cart-shop-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-main">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span className="cart-header-price">Price</span>
          </div>

          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <Link to={`/products/${item.product_id}`}>
                  <img
                    src={item.image_url || 'https://via.placeholder.com/200'}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/200'; }}
                  />
                </Link>
              </div>
              <div className="cart-item-details">
                <Link to={`/products/${item.product_id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-brand text-secondary">{item.brand}</p>
                {item.is_prime && <span className="cart-prime-badge">prime</span>}
                <p className="cart-item-stock text-green">In Stock</p>
                <p className="cart-item-delivery">FREE delivery: <strong>Tomorrow</strong></p>
                <div className="cart-item-actions">
                  <div className="cart-qty-control">
                    <button
                      onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                      className="qty-btn"
                    >−</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                  </div>
                  <span className="cart-action-divider">|</span>
                  <button onClick={() => removeItem(item.id)} className="cart-remove-btn">Delete</button>
                  <span className="cart-action-divider">|</span>
                  <button className="cart-action-link">Save for later</button>
                </div>
              </div>
              <div className="cart-item-price">
                {formatPrice(parseFloat(item.price) * item.quantity)}
              </div>
            </div>
          ))}

          <div className="cart-subtotal-row">
            Subtotal ({cart.item_count} item{cart.item_count !== 1 ? 's' : ''}):
            <span className="cart-subtotal-amount"> <strong>{formatPrice(subtotal)}</strong></span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="cart-sidebar">
          <div className="cart-summary-box">
            {parseFloat(subtotal) >= 499 ? (
              <p className="cart-eligible-msg">✅ Your order qualifies for FREE Delivery.</p>
            ) : (
              <p className="cart-eligible-msg">
                Add <strong>{formatPrice(499 - parseFloat(subtotal))}</strong> more for FREE Delivery.
              </p>
            )}

            <div className="cart-summary-total">
              <p>Subtotal ({cart.item_count} items):
                <span className="summary-price">{formatPrice(subtotal)}</span>
              </p>
              <p>Shipping:
                <span className="summary-price">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </p>
              <p>GST (18%):
                <span className="summary-price">{formatPrice(tax)}</span>
              </p>
              <hr />
              <p className="summary-total-row">
                Order Total:
                <span className="summary-price summary-total">{formatPrice(total)}</span>
              </p>
            </div>

            <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Buy ({cart.item_count} item{cart.item_count !== 1 ? 's' : ''})
            </button>
          </div>

          {/* Similar items / promo */}
          <div className="cart-promo-box">
            <h4>Try Prime</h4>
            <p>Free fast delivery, exclusive deals, and more.</p>
            <button className="prime-try-btn-small">Try Prime FREE for 30 days</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
