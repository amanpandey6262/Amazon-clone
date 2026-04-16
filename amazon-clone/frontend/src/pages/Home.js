import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

const HeroBanner = () => {
  const banners = [
    { title: 'Up to 40% off Electronics', subtitle: 'Laptops, Phones, Headphones & more', link: '/products?category=electronics', gradient: 'linear-gradient(135deg, #131921 0%, #1a3a5c 100%)', accent: '#FF9900' },
    { title: 'Bestselling Books', subtitle: 'Explore top titles from all genres', link: '/products?category=books', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', accent: '#00A8E1' },
    { title: 'Home & Kitchen Sale', subtitle: 'Upgrade your home essentials', link: '/products?category=home-kitchen', gradient: 'linear-gradient(135deg, #2d1b0e 0%, #5c3317 100%)', accent: '#FF9900' },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[current];
  return (
    <div className="hero-banner" style={{ background: b.gradient }}>
      <div className="hero-content">
        <h1 className="hero-title" style={{ color: b.accent }}>{b.title}</h1>
        <p className="hero-subtitle">{b.subtitle}</p>
        <Link to={b.link} className="hero-btn">Shop Now</Link>
      </div>
      <div className="hero-dots">
        {banners.map((_, i) => (
          <button key={i} className={`hero-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
};

const CategoryGrid = ({ categories }) => (
  <div className="home-section">
    <div className="home-section-grid">
      {categories.slice(0, 4).map(cat => (
        <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-card">
          <div className="category-icon">{cat.icon}</div>
          <div className="category-name">{cat.name}</div>
          <div className="category-count">{cat.product_count} items</div>
          <span className="category-shop">Shop now</span>
        </Link>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productAPI.getFeatured(),
      categoryAPI.getAll(),
    ]).then(([fp, cp]) => {
      setFeatured(fp.data);
      setCategories(cp.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <HeroBanner />

      <div className="home-container">
        {/* Category Quick Links */}
        {categories.length > 0 && <CategoryGrid categories={categories} />}

        {/* Prime Banner */}
        <div className="prime-banner">
          <div className="prime-banner-content">
            <span className="prime-badge-large">prime</span>
            <div>
              <h3>Unlimited FREE fast delivery, video streaming & more</h3>
              <p>Try Prime FREE for 30 days</p>
            </div>
            <button className="prime-try-btn">Try Prime FREE</button>
          </div>
        </div>

        {/* Featured Products */}
        <section className="home-products-section">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="section-see-all">See all deals →</Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Category Sections */}
        {categories.slice(0, 4).map(cat => (
          <CategorySection key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
};

const CategorySection = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll({ category: category.slug, limit: 4, sort: 'rating' })
      .then(({ data }) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [category.slug]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="home-products-section">
      <div className="section-header">
        <h2 className="section-title">{category.icon} {category.name}</h2>
        <Link to={`/products?category=${category.slug}`} className="section-see-all">See all →</Link>
      </div>
      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div className="products-grid products-grid-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default Home;
