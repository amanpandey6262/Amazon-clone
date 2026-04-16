import React, { useState, useEffect } from 'react';
import './Checkout.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout({ refreshCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('123 MG Road, Bangalore, Karnataka 560001');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/cart');
        setCartItems(res.data);
        if (res.data.length === 0) {
          navigate('/cart');
        }
      } catch (err) {
        console.error('Error fetching cart', err);
      }
    };
    fetchCart();
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const formatPrice = (val) => '₹' + val.toLocaleString('en-IN', {minimumFractionDigits: 2});

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/orders', { address });
      if (refreshCart) refreshCart();
      navigate('/order-confirmation', { state: { orderId: res.data.id, totalAmount: res.data.totalAmount } });
    } catch (err) {
      console.error('Error placing order', err);
      alert('Failed to place order');
    }
  };

  return (
    <div className="checkout">
      <h1 style={{marginBottom: '20px', textAlign: 'center'}}>Checkout ({totalItems} items)</h1>
      <div className="checkout__container">
        
        <form className="checkout__form" onSubmit={handlePlaceOrder}>
          <h2>1 Shipping address</h2>
          <textarea 
            className="checkout__input" 
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <h2>2 Payment method</h2>
          <p style={{marginBottom: '10px'}}>Paying with Default Card ending in **** 1234</p>
          <hr style={{margin: '20px 0'}} />
          <button type="submit" className="btn-primary" style={{width: '200px'}}>Place your order</button>
        </form>

        <div className="checkout__summary">
          <button className="btn-primary" style={{width: '100%', marginBottom: '10px'}} onClick={handlePlaceOrder}>
            Place your order
          </button>
          <p style={{fontSize: '12px', textAlign: 'center', marginBottom: '20px'}}>
            By placing your order, you agree to Amazon's privacy notice and conditions of use.
          </p>
          <h3>Order Summary</h3>
          <div className="checkout__summaryLine">
            <span>Items:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="checkout__summaryLine">
            <span>Shipping & handling:</span>
            <span>₹0.00</span>
          </div>
          <div className="checkout__summaryLine">
            <span>Total before tax:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="checkout__summaryLine checkout__total">
            <span>Order total:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
