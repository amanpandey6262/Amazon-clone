import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('https://amazon-clone-0344.onrender.com/api/cart');
      const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartItemCount(count);
    } catch (err) {
      console.error('Error fetching cart count', err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<><Header cartItemCount={cartItemCount} /><Home refreshCart={fetchCartCount} /></>} />
        <Route path="/product/:id" element={<><Header cartItemCount={cartItemCount} /><ProductDetail refreshCart={fetchCartCount} /></>} />
        <Route path="/cart" element={<><Header cartItemCount={cartItemCount} /><Cart refreshCart={fetchCartCount} /></>} />
        <Route path="/checkout" element={<><Header cartItemCount={cartItemCount} /><Checkout refreshCart={fetchCartCount} /></>} />
        <Route path="/order-confirmation" element={<><Header cartItemCount={cartItemCount} /><OrderConfirmation /></>} />
        <Route path="/orders" element={<><Header cartItemCount={cartItemCount} /><Orders /></>} />
        <Route path="/wishlist" element={<><Header cartItemCount={cartItemCount} /><Wishlist refreshCart={fetchCartCount} /></>} />
      </Routes>
    </div>
  );
}

export default App;
