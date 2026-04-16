import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import StarRating from '../components/common/StarRating';
import './Wishlist.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(p));

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = () => {
    wishlistAPI.get()
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.toggle(productId);
      setItems(items.filter(i => i.product_id !== productId));
      toast.info('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    const ok = await addToCart(item.product_id, 1);
    if (ok) await handleRemove(item.product_id);
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Your Wish List</h1>
          <span className="wishlist-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">🤍</div>
            <h2>Your Wish List is empty</h2>
            <p>Add items that you want to buy later by clicking the "Add to Wishlist" button on any product page.</p>
            <Link to="/products" className="wishlist-shop-btn">Discover products to add</Link>
          </div>
        ) : (
          <div className="wishlist-layout">
            <div className="wishlist-main">
              <div className="wishlist-sort-bar">
                <span>Sort by: </span>
                <select className="wishlist-sort-select">
                  <option>Date Added</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <span className="wishlist-share-btn">🔗 Share list</span>
              </div>

              <div className="wishlist-items">
                {items.map(item => {
                  const discount = item.original_price && parseFloat(item.original_price) > parseFloat(item.price)
                    ? Math.round(((item.original_price - item.price) / item.original_price) * 100) : null;

                  return (
                    <div key={item.id} className="wishlist-item">
                      <div className="wishlist-item-img-wrap">
                        <Link to={`/products/${item.product_id}`}>
                          <img
                            src={item.image_url || 'https://via.placeholder.com/180'}
                            alt={item.name}
                            onError={e => { e.target.src = 'https://via.placeholder.com/180'; }}
                          />
                        </Link>
                        {discount && <span className="wishlist-discount-badge">-{discount}%</span>}
                      </div>

                      <div className="wishlist-item-details">
                        <Link to={`/products/${item.product_id}`} className="wishlist-item-name">
                          {item.name}
                        </Link>

                        <div className="wishlist-item-rating">
                          <StarRating rating={parseFloat(item.rating || 0)} />
                          <span className="wishlist-review-count">({Number(item.review_count || 0).toLocaleString()})</span>
                        </div>

                        <div className="wishlist-item-price">
                          <span className="wishlist-current-price">{formatPrice(item.price)}</span>
                          {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                            <span className="wishlist-original-price">
                              M.R.P.: <s>{formatPrice(item.original_price)}</s>
                            </span>
                          )}
                        </div>

                        {item.is_prime && (
                          <div className="wishlist-prime">
                            <span className="prime-tag-sm">prime</span>
                            <span> FREE Delivery</span>
                          </div>
                        )}

                        <p className="wishlist-added-date text-secondary">
                          Added {new Date(item.added_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>

                        <div className="wishlist-item-actions">
                          <button
                            className="wishlist-add-cart-btn"
                            onClick={() => handleMoveToCart(item)}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => handleRemove(item.product_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="wishlist-sidebar">
              <div className="wishlist-sidebar-box">
                <h3>Your list, your way</h3>
                <p>Share your wish list with friends and family, or keep it private just for you.</p>
                <button className="wishlist-sidebar-btn">Share your Wish List</button>
              </div>
              <div className="wishlist-sidebar-box">
                <h3>Total ({items.length} items):</h3>
                <p className="wishlist-total">
                  {formatPrice(items.reduce((s, i) => s + parseFloat(i.price), 0))}
                </p>
                <p className="text-secondary" style={{ fontSize: 12 }}>
                  Price may vary at time of purchase
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
