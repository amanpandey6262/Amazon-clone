import React, { useState, useEffect } from 'react';
import './Cart.css';
import CartItem from '../components/CartItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart({ refreshCart }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      await axios.put(`http://localhost:3001/api/cart/${id}`, { quantity });
      fetchCart();
      if (refreshCart) refreshCart();
    } catch (err) {
      console.error('Error updating quantity', err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/cart/${id}`);
      fetchCart();
      if (refreshCart) refreshCart();
    } catch (err) {
      console.error('Error removing item', err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart">
      <div className="cart__left">
        <h2 className="cart__title">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your Amazon Cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <CartItem 
              key={item.id}
              id={item.id}
              product={item.product}
              quantity={item.quantity}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      <div className="cart__right">
        <div className="cart__subtotal">
          <p>Subtotal ({totalItems} items): <strong>₹{subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong></p>
          <small style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px'}}>
            <input type="checkbox" /> This order contains a gift
          </small>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/checkout')}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
