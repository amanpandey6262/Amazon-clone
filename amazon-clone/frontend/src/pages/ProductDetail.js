import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/common/ProductCard';
import './ProductDetail.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const ImageCarousel = ({ images }) => {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return (
    <div className="carousel-main-wrap">
      <img src="https://via.placeholder.com/500x500?text=No+Image" alt="No product" className="carousel-main-img" />
    </div>
  );
  return (
    <div className="carousel">
      <div className="carousel-thumbs">
        {images.map((img, i) => (
          <button key={i} className={`thumb-btn ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
            <img src={img.image_url} alt={img.alt_text || `View ${i + 1}`} />
          </button>
        ))}
      </div>
      <div className="carousel-main-wrap">
        <img src={images[active]?.image_url} alt="Product" className="carousel-main-img" />
        {images.length > 1 && (
          <div className="carousel-nav">
            <button onClick={() => setActive(a => (a - 1 + images.length) % images.length)}>‹</button>
            <span>{active + 1} / {images.length}</span>
            <button onClick={() => setActive(a => (a + 1) % images.length)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(({ data }) => {
        setProduct(data);
        return wishlistAPI.check(id);
      })
      .then(({ data }) => setWishlisted(data.wishlisted))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const ok = await addToCart(product.id, quantity);
    if (ok) setAddedToCart(true);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    try {
      const { data } = await wishlistAPI.toggle(product.id);
      setWishlisted(data.wishlisted);
    } catch {}
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return <div className="not-found"><h2>Product not found</h2><Link to="/products">Browse products</Link></div>;

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const inStock = product.stock_quantity > 0;
  const specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : (product.specifications || {});

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link> ›{' '}
          <Link to="/products">Products</Link> ›{' '}
          {product.category_name && <><Link to={`/products?category=${product.category_slug}`}>{product.category_name}</Link> › </>}
          <span>{product.name.substring(0, 50)}...</span>
        </div>

        <div className="product-detail-layout">
          {/* Left: Images */}
          <div className="product-detail-images">
            <ImageCarousel images={product.images} />
            <button className={`wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist}>
              {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>

          {/* Center: Info */}
          <div className="product-detail-info">
            {product.brand && <p className="detail-brand">Brand: <a href="#" className="brand-link">{product.brand}</a></p>}
            <h1 className="detail-title">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <StarRating rating={parseFloat(product.rating)} size="lg" />
              <a href="#reviews" className="detail-review-count">
                {Number(product.review_count || 0).toLocaleString()} ratings
              </a>
              {product.is_prime && <span className="detail-prime-badge">prime</span>}
            </div>

            <div className="detail-divider" />

            {/* Price */}
            <div className="detail-price-block">
              <div className="detail-price-row">
                <span className="detail-price-label">Price: </span>
                <span className="detail-price">{formatPrice(product.price)}</span>
                {discount && <span className="detail-discount-badge">-{discount}%</span>}
              </div>
              {product.original_price && product.original_price > product.price && (
                <p className="detail-original-price">
                  M.R.P.: <s>{formatPrice(product.original_price)}</s>
                  <span className="detail-savings"> Save {formatPrice(product.original_price - product.price)}</span>
                </p>
              )}
              {product.is_prime && (
                <div className="detail-prime-delivery">
                  <span className="prime-tag">prime</span>
                  <span> FREE Delivery by <strong>Tomorrow</strong></span>
                </div>
              )}
            </div>

            <div className="detail-divider" />

            {/* Stock */}
            <div className="detail-stock">
              {inStock ? (
                product.stock_quantity <= 5 ? (
                  <p className="text-red font-bold">Only {product.stock_quantity} left in stock - order soon!</p>
                ) : (
                  <p className="text-green font-bold" style={{ fontSize: 18 }}>In Stock</p>
                )
              ) : (
                <p className="text-red font-bold">Currently unavailable.</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="detail-description">
                <p>{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="detail-specs">
                <h3>Technical Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="spec-key">{k}</td>
                        <td className="spec-val">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Buy Box */}
          <div className="product-detail-buybox">
            <div className="buybox-price">{formatPrice(product.price)}</div>
            {product.is_prime && (
              <div className="buybox-prime">
                <span className="prime-tag">prime</span> FREE Delivery
              </div>
            )}

            <div className="buybox-delivery">
              <p>📦 Estimated delivery: <strong>Tomorrow</strong></p>
              <p className="buybox-location">📍 Deliver to India</p>
            </div>

            <div className="buybox-stock">
              {inStock
                ? <span className="text-green font-bold">In Stock</span>
                : <span className="text-red">Currently unavailable</span>}
            </div>

            {inStock && (
              <div className="buybox-qty">
                <label>Qty: </label>
                <select value={quantity} onChange={e => setQuantity(parseInt(e.target.value))}>
                  {Array.from({ length: Math.min(10, product.stock_quantity) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            {inStock && (
              <>
                {addedToCart ? (
                  <Link to="/cart" className="buybox-btn buybox-btn-cart" style={{ display: 'block', textAlign: 'center' }}>
                    Go to Cart →
                  </Link>
                ) : (
                  <button className="buybox-btn buybox-btn-cart" onClick={handleAddToCart} disabled={cartLoading}>
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
                <button className="buybox-btn buybox-btn-buynow" onClick={handleBuyNow} disabled={cartLoading}>
                  Buy Now
                </button>
              </>
            )}

            <div className="buybox-footer">
              <p>🔒 Secure transaction</p>
              <p>Ships from and sold by <strong>Amazon.clone</strong></p>
              <p>Return policy: 30 days</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <section className="related-products">
            <h2>Customers also viewed</h2>
            <div className="related-grid">
              {product.related_products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
