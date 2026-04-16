import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ refreshCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:3001/api/cart', { productId: product.id, quantity: 1 });
      if (refreshCart) refreshCart();
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('http://localhost:3001/api/wishlist', { productId: product.id });
      alert('Added to Wish List!');
    } catch (err) {
      if (err.response && err.response.data.error === 'Product already in wishlist') {
        alert('Product is already in your Wish List.');
      } else {
        console.error('Error adding to wishlist', err);
      }
    }
  };

  if (!product) return <h2 style={{padding: '40px', textAlign: 'center'}}>Loading...</h2>;

  const images = JSON.parse(product.images);

  return (
    <div className="productDetail">
      <div className="productDetail__left">
        <div className="productDetail__imagesThumbnail">
          {images.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt="Thumbnail" 
              className={`productDetail__thumbnail ${index === activeImageIndex ? 'active' : ''}`}
              onMouseEnter={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
        <div className="productDetail__mainImage">
          <img src={images[activeImageIndex]} alt={product.title} />
        </div>
      </div>

      <div className="productDetail__middle">
        <h1 className="productDetail__title">{product.title}</h1>
        <hr style={{margin: '10px 0', borderColor: '#eee'}} />
        <p className="productDetail__price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="productDetail__description">{product.description}</p>
        <br />
        <p><strong>Category:</strong> {product.category}</p>
      </div>

      <div className="productDetail__right">
        <p className="productDetail__rightPrice">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="productDetail__stock">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
        <button className="btn-secondary" onClick={handleBuyNow}>Buy Now</button>
        <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <button style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', padding: '5px' }} onClick={handleAddToWishlist}>
            Add to Wish List
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
