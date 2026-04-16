import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', margin: 24, borderRadius: 4 }}>
                  <h1 style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }}>404</h1>
                  <h2 style={{ fontWeight: 400, marginBottom: 16 }}>We can't find that page</h2>
                  <p style={{ color: '#777', marginBottom: 24 }}>The page you're looking for doesn't exist or has been moved.</p>
                  <a href="/" style={{ color: '#007185', fontSize: 16 }}>← Go to Homepage</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
