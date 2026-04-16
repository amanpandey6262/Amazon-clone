import React, { useState, useEffect } from 'react';
import './Orders.css'; // Reuse orders CSS for layout
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Wishlist({ refreshCart }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('https://amazon-clone-0344.onrender.com/api/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Error fetching wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`https://amazon-clone-0344.onrender.com/api/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from wishlist', err);
    }
  };

  const moveToCart = async (item) => {
    try {
      await axios.post('https://amazon-clone-0344.onrender.com/api/cart', {
        productId: item.productId,
        quantity: 1
      });
      refreshCart();
      await removeFromWishlist(item.id);
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  const formatPrice = (val) => '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  if (loading) return <h2 style={{ padding: '40px', textAlign: 'center' }}>Loading your Wish List...</h2>;

  return (
    <div className="orders">
      <h2 className="orders__title">Your Wish List</h2>

      {wishlist.length === 0 ? (
        <div className="orders__empty">
          <h3>Your wish list is empty</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>Explore products and save them for later!</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="order__card">
          <div className="order__items">
            {wishlist.map(item => {
              const images = JSON.parse(item.product.images);
              return (
                <div className="order__item" key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img className="order__itemImage" src={images[0]} alt={item.product.title} />
                    <div className="order__itemInfo">
                      <p className="order__itemTitle" onClick={() => navigate(`/product/${item.product.id}`)}>
                        {item.product.title}
                      </p>
                      <p className="order__itemMeta">{formatPrice(item.product.price)}</p>
                      <p style={{ fontSize: '12px', color: '#007185', cursor: 'pointer', marginTop: '10px' }} onClick={() => removeFromWishlist(item.id)}>
                        Delete
                      </p>
                    </div>
                  </div>
                  <div>
                    <button className="btn-primary" onClick={() => moveToCart(item)}>Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
