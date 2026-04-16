import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (val) => '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  if (loading) return <h2 style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</h2>;

  return (
    <div className="orders">
      <h2 className="orders__title">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="orders__empty">
          <h3>No orders yet</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>You haven't placed any orders. Start shopping!</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        orders.map(order => (
          <div className="order__card" key={order.id}>
            <div className="order__header">
              <div>
                <span className="label">Order Placed</span>
                <span className="value">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="label">Total</span>
                <span className="value">{formatPrice(order.totalAmount)}</span>
              </div>
              <div>
                <span className="label">Ship To</span>
                <span className="value">{order.address.substring(0, 30)}...</span>
              </div>
              <div>
                <span className="label">Order #</span>
                <span className="value">{order.id}</span>
              </div>
            </div>

            <div className="order__items">
              {order.items.map(item => {
                const images = JSON.parse(item.product.images);
                return (
                  <div className="order__item" key={item.id}>
                    <img className="order__itemImage" src={images[0]} alt={item.product.title} />
                    <div className="order__itemInfo">
                      <p className="order__itemTitle" onClick={() => navigate(`/product/${item.product.id}`)}>
                        {item.product.title}
                      </p>
                      <p className="order__itemMeta">Qty: {item.quantity} | {formatPrice(item.price)} each</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
