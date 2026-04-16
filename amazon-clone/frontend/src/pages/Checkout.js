import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(p));

const STEPS = ['Shipping Address', 'Payment', 'Review Order'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    full_name: 'John Doe',
    phone: '9876543210',
    address_line1: '123, MG Road',
    address_line2: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    postal_code: '462001',
    country: 'India',
  });

  const [payment, setPayment] = useState('cod');

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = parseFloat(cart.subtotal || 0);
  const shipping = subtotal >= 499 ? 0 : 40;
  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const total = subtotal + shipping + tax;

  const validateAddress = () => {
    const required = ['full_name', 'address_line1', 'city', 'state', 'postal_code'];
    for (const f of required) {
      if (!address[f].trim()) {
        toast.error(`Please fill in ${f.replace(/_/g, ' ')}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateAddress()) return;
    setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await orderAPI.create({
        shipping_address: address,
        payment_method: payment,
      });
      navigate(`/order-confirmation/${data.id}`, { state: { order: data } });
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div style={{ textAlign: 'center', padding: 80 }}>
          <h2>Your cart is empty</h2>
          <Link to="/products" className="checkout-back-btn" style={{ marginTop: 16, display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#131921', fontSize: 26, fontWeight: 700 }}>amazon</span>
            <span style={{ color: '#FF9900' }}>.clone</span>
          </Link>
          <span className="checkout-secure">🔒 Secure Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`checkout-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                <span className="step-num">{i < step ? '✓' : i + 1}</span>
                <span className="step-name">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left: Step Content */}
          <div className="checkout-main">
            {/* Step 0: Shipping Address */}
            {step === 0 && (
              <div className="checkout-card">
                <h2>📦 Shipping Address</h2>
                <div className="address-form">
                  <div className="form-row form-row-2">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="full_name" value={address.full_name} onChange={handleAddressChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="10-digit mobile number" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address Line 1 *</label>
                    <input name="address_line1" value={address.address_line1} onChange={handleAddressChange} placeholder="House No., Street, Area" />
                  </div>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input name="address_line2" value={address.address_line2} onChange={handleAddressChange} placeholder="Landmark, Apartment (optional)" />
                  </div>
                  <div className="form-row form-row-3">
                    <div className="form-group">
                      <label>City *</label>
                      <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City" />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <select name="state" value={address.state} onChange={handleAddressChange}>
                        {['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input name="postal_code" value={address.postal_code} onChange={handleAddressChange} placeholder="6-digit pincode" maxLength={6} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input name="country" value={address.country} readOnly style={{ background: '#f7f7f7' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-card">
                <h2>💳 Payment Method</h2>
                <div className="payment-options">
                  {[
                    { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', label: '📱 UPI', desc: 'Google Pay, PhonePe, BHIM' },
                    { value: 'card', label: '💳 Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { value: 'netbanking', label: '🏦 Net Banking', desc: 'All major Indian banks' },
                    { value: 'wallet', label: '💰 Amazon Pay', desc: 'Use Amazon Pay wallet balance' },
                  ].map(opt => (
                    <label key={opt.value} className={`payment-option ${payment === opt.value ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={e => setPayment(e.target.value)} />
                      <div className="payment-option-content">
                        <span className="payment-label">{opt.label}</span>
                        <span className="payment-desc">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="payment-secure-note">
                  <p>🔒 All transactions are encrypted and secure.</p>
                </div>
              </div>
            )}

            {/* Step 2: Review Order */}
            {step === 2 && (
              <div className="checkout-card">
                <h2>📋 Review Your Order</h2>
                <div className="review-address">
                  <h4>Delivering to:</h4>
                  <p><strong>{address.full_name}</strong></p>
                  <p>{address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}</p>
                  <p>{address.city}, {address.state} - {address.postal_code}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>📞 {address.phone}</p>}
                  <button className="review-edit-link" onClick={() => setStep(0)}>Edit</button>
                </div>
                <div className="review-payment">
                  <h4>Payment:</h4>
                  <p>{payment === 'cod' ? '💵 Cash on Delivery' : payment === 'upi' ? '📱 UPI' : payment === 'card' ? '💳 Card' : payment === 'netbanking' ? '🏦 Net Banking' : '💰 Amazon Pay'}</p>
                  <button className="review-edit-link" onClick={() => setStep(1)}>Edit</button>
                </div>
                <h4 style={{ margin: '16px 0 12px' }}>Items in order:</h4>
                {cart.items.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.image_url || 'https://via.placeholder.com/70'} alt={item.name} />
                    <div className="review-item-info">
                      <p className="review-item-name">{item.name}</p>
                      <p className="text-secondary">Qty: {item.quantity}</p>
                      {item.is_prime && <span className="cart-prime-badge">prime</span>}
                    </div>
                    <p className="review-item-price">
                      {formatPrice(parseFloat(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="checkout-nav">
              {step > 0 && (
                <button className="checkout-back-btn" onClick={() => setStep(s => s - 1)}>
                  ← Back
                </button>
              )}
              {step < 2 ? (
                <button className="checkout-next-btn" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button className="checkout-place-btn" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? '⏳ Placing Order...' : '🛒 Place Your Order'}
                </button>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-box">
              {step === 2 && (
                <p className="checkout-agree">
                  By placing your order, you agree to Amazon.clone's <a href="#">conditions of use</a> and <a href="#">privacy notice</a>.
                </p>
              )}
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Items ({cart.item_count}):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>{shipping === 0 ? <span className="text-green">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="summary-row">
                  <span>GST (18%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Order Total:</span>
                  <span className="text-red">{formatPrice(total)}</span>
                </div>
              </div>
              {step === 2 && (
                <button className="checkout-place-btn-sm" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Placing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
