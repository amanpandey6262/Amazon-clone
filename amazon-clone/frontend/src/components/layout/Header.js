import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { categoryAPI } from '../../utils/api';
import './Header.css';

const Header = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-main">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-text">
            <span className="logo-amazon">amazon</span>
            <span className="logo-clone">.clone</span>
          </div>
          <span className="logo-in">.in</span>
        </Link>

        {/* Deliver To */}
        <div className="header-deliver hide-mobile">
          <span className="deliver-label">Deliver to</span>
          <div className="deliver-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>India</span>
          </div>
        </div>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <select
            className="search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon.clone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Account */}
          <div className="header-action">
            <span className="action-label">Hello, John</span>
            <span className="action-main font-bold">Account & Lists ▾</span>
          </div>

          {/* Returns */}
          <Link to="/orders" className="header-action hide-mobile">
            <span className="action-label">Returns</span>
            <span className="action-main font-bold">& Orders</span>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="header-action hide-mobile">
            <span className="action-label">Your</span>
            <span className="action-main font-bold">Wishlist ♡</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="header-cart">
            <div className="cart-icon-wrap">
              <svg width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
                <path d="M14 28c-2.21 0-3.99 1.79-3.99 4S11.79 36 14 36s4-1.79 4-4-1.79-4-4-4zm18 0c-2.21 0-3.99 1.79-3.99 4S29.79 36 32 36s4-1.79 4-4-1.79-4-4-4zM5.5 6H2V2H0V0h7.5l.85 4H38l-3.67 16H13.23L11 6H5.5z" transform="scale(0.75) translate(2, -2)"/>
              </svg>
              <span className="cart-count">{cart.item_count || 0}</span>
            </div>
            <span className="cart-label font-bold">Cart</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="mobile-menu-btn show-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span>☰</span>
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="header-nav">
        <button className="nav-all-btn">
          <span>☰</span> All
        </button>
        {categories.slice(0, 8).map(cat => (
          <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="nav-link">
            {cat.name}
          </Link>
        ))}
        <Link to="/products" className="nav-link">Today's Deals</Link>
        <Link to="/products?sort=rating" className="nav-link">Best Sellers</Link>
        <Link to="/products?sort=newest" className="nav-link">New Arrivals</Link>
      </nav>

      {/* Mobile Search */}
      <form className="mobile-search show-mobile" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
    </header>
  );
};

export default Header;
