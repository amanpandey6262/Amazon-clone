import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: '0.00', item_count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = '') => {
    setLoading(true);
    try {
      await cartAPI.addItem(productId, quantity);
      await fetchCart();
      toast.success(`Added to cart!`, { autoClose: 2000 });
      return true;
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to add to cart';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      toast.info('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
