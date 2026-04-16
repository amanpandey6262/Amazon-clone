import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const totalAmount = location.state?.totalAmount;

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px',
      backgroundColor: 'white',
      margin: '40px auto',
      maxWidth: '800px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <CheckCircle size={64} color="#007600" style={{marginBottom: '20px'}} />
      <h1 style={{color: '#007600', marginBottom: '20px'}}>Order Placed Successfully!</h1>
      <p style={{fontSize: '18px', marginBottom: '20px', textAlign: 'center'}}>
        Thank you for your purchase. A confirmation email has been sent to your registered email address.
      </p>
      {orderId && (
        <div style={{padding: '20px', backgroundColor: '#f3f3f3', borderRadius: '4px', marginBottom: '10px', textAlign: 'center'}}>
          <strong>Order Number:</strong> #{orderId}
        </div>
      )}
      {totalAmount && (
        <div style={{padding: '10px 20px', backgroundColor: '#f3f3f3', borderRadius: '4px', marginBottom: '20px', textAlign: 'center'}}>
          <strong>Total:</strong> ₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </div>
      )}
      <div style={{display: 'flex', gap: '15px'}}>
        <Link to="/orders">
          <button className="btn-secondary">View Orders</button>
        </Link>
        <Link to="/">
          <button className="btn-primary">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
