import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import StarRating from './StarRating';
import './ProductCard.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        {/* Image */}
        <div className="product-card-image-wrap">
          <img
            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
            onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
          />
          {discount && <span className="product-badge">-{discount}%</span>}
          {product.is_prime && (
            <span className="product-prime-badge">
              <span className="prime-logo">prime</span>
            </span>
          )}
        </div>

        {/* Info */}
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>

          <div className="product-card-rating">
            <StarRating rating={product.rating} />
            <span className="rating-count">({Number(product.review_count || 0).toLocaleString()})</span>
          </div>

          <div className="product-card-price">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="price-original">M.R.P: <s>{formatPrice(product.original_price)}</s></span>
            )}
          </div>

          {product.is_prime && (
            <div className="product-card-prime">
              <span className="prime-text">FREE Delivery by Tomorrow</span>
            </div>
          )}

          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <p className="product-card-stock">Only {product.stock_quantity} left in stock!</p>
          )}
        </div>
      </Link>

      <button className="product-card-add-btn" onClick={handleAddToCart} disabled={loading || product.stock_quantity === 0}>
        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
