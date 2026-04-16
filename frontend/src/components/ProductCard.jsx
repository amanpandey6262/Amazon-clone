import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductCard({ id, title, price, image, category, onAddToCart }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      await axios.post('http://localhost:3001/api/wishlist', { productId: id });
      alert('Added to Wish List!');
    } catch (err) {
      if (err.response && err.response.data.error === 'Product already in wishlist') {
        alert('Product is already in your Wish List.');
      } else {
        console.error('Error adding to wishlist', err);
      }
    }
  };

  return (
    <div className="product" onClick={handleClick}>
      <img src={image} alt={title} />
      
      <div className="product__info">
        <p className="product__title" title={title}>{title}</p>
        <p className="product__price">
          <small>₹</small>
          <strong>{price.toLocaleString('en-IN')}</strong>
        </p>
      </div>

      <button className="btn-primary product__addToCart" onClick={handleAddToCart}>
        Add to Cart
      </button>
      <button 
        style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }} 
        onClick={handleAddToWishlist}
      >
        Add to Wish List
      </button>
    </div>
  );
}

export default ProductCard;
