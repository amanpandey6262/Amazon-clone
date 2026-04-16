import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './ProductList.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ search, category, sort, page, limit: 24 });
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
    categoryAPI.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const title = search
    ? `Results for "${search}"`
    : category
    ? (categories.find(c => c.slug === category)?.name || 'Category')
    : 'All Products';

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        {/* Sidebar */}
        <aside className={`product-list-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="sidebar-close show-mobile" onClick={() => setMobileFiltersOpen(false)}>✕</button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Department</h4>
            <ul className="filter-list">
              <li>
                <a
                  href="#"
                  className={`filter-item ${!category ? 'active' : ''}`}
                  onClick={e => { e.preventDefault(); updateParam('category', ''); }}
                >
                  All Departments
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.slug}>
                  <a
                    href="#"
                    className={`filter-item ${category === cat.slug ? 'active' : ''}`}
                    onClick={e => { e.preventDefault(); updateParam('category', cat.slug); }}
                  >
                    {cat.name}
                    <span className="filter-count">({cat.product_count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price</h4>
            <ul className="filter-list">
              {[
                { label: 'Under ₹500', min: null, max: 500 },
                { label: '₹500 – ₹2,000', min: 500, max: 2000 },
                { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
                { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
                { label: 'Over ₹50,000', min: 50000, max: null },
              ].map(r => (
                <li key={r.label}>
                  <a
                    href="#"
                    className="filter-item"
                    onClick={e => {
                      e.preventDefault();
                      const next = new URLSearchParams(searchParams);
                      if (r.min) next.set('min_price', r.min); else next.delete('min_price');
                      if (r.max) next.set('max_price', r.max); else next.delete('max_price');
                      setSearchParams(next);
                    }}
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Prime Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Delivery</h4>
            <ul className="filter-list">
              <li><a href="#" className="filter-item">⚡ Get It by Tomorrow</a></li>
              <li><a href="#" className="filter-item">📦 Free Shipping</a></li>
            </ul>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>Clear all filters</button>
        </aside>

        {/* Main Content */}
        <main className="product-list-main">
          {/* Top Bar */}
          <div className="product-list-topbar">
            <div className="topbar-left">
              <button className="mobile-filter-btn show-mobile" onClick={() => setMobileFiltersOpen(true)}>
                ⚙️ Filters
              </button>
              <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span> › </span>
                <span>{title}</span>
              </div>
            </div>
            <div className="topbar-right">
              <span className="result-count">
                {pagination.total > 0 && `${((page - 1) * 24) + 1}–${Math.min(page * 24, pagination.total)} of ${pagination.total.toLocaleString()} results`}
              </span>
              <div className="sort-control">
                <label>Sort by: </label>
                <select value={sort} onChange={e => updateParam('sort', e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="product-list-title">{title}</h1>

          {/* Product Grid */}
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <p>🔍 No results found for your search.</p>
              <button onClick={clearFilters} className="clear-filters-btn">Clear filters</button>
            </div>
          ) : (
            <div className="products-grid-list">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', p);
                    setSearchParams(next);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
