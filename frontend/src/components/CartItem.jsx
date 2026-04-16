import React from 'react';
import './CartItem.css';

function CartItem({ id, product, quantity, onUpdateQuantity, onRemove }) {
  const images = JSON.parse(product.images);
  return (
    <div className="cartItem">
      <img className="cartItem__image" src={images[0]} alt={product.title} />

      <div className="cartItem__info">
        <p className="cartItem__title">{product.title}</p>
        <p className="cartItem__price">
          <strong>₹{product.price.toLocaleString('en-IN')}</strong>
        </p>
        <p style={{color: 'green', fontSize: '12px'}}>In Stock</p>

        <div className="cartItem__actions">
          <div className="cartItem__qty">
            <button className="cartItem__btn" onClick={() => onUpdateQuantity(id, quantity - 1)}>-</button>
            <span>{quantity}</span>
            <button className="cartItem__btn" onClick={() => onUpdateQuantity(id, quantity + 1)}>+</button>
          </div>
          <p>|</p>
          <button className="cartItem__delete" onClick={() => onRemove(id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
