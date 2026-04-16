import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <button className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      Back to top
    </button>
    <div className="footer-links">
      <div className="footer-col">
        <h3>Get to Know Us</h3>
        <a href="#">Careers</a>
        <a href="#">Blog</a>
        <a href="#">About Amazon</a>
        <a href="#">Investor Relations</a>
        <a href="#">Amazon Devices</a>
      </div>
      <div className="footer-col">
        <h3>Make Money with Us</h3>
        <a href="#">Sell products on Amazon</a>
        <a href="#">Sell on Amazon Business</a>
        <a href="#">Sell apps on Amazon</a>
        <a href="#">Become an Affiliate</a>
        <a href="#">Advertise Your Products</a>
      </div>
      <div className="footer-col">
        <h3>Amazon Payment Products</h3>
        <a href="#">Amazon Business Card</a>
        <a href="#">Shop with Points</a>
        <a href="#">Reload Your Balance</a>
        <a href="#">Amazon Currency Converter</a>
      </div>
      <div className="footer-col">
        <h3>Let Us Help You</h3>
        <a href="#">Amazon and COVID-19</a>
        <a href="#">Your Account</a>
        <Link to="/orders">Your Orders</Link>
        <a href="#">Shipping Rates & Policies</a>
        <a href="#">Returns & Replacements</a>
        <a href="#">Manage Your Content and Devices</a>
        <a href="#">Help</a>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="footer-logo">
        <span style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>amazon</span>
        <span style={{ color: '#FF9900', fontSize: 22, fontWeight: 700 }}>.clone</span>
        <span style={{ color: '#FF9900' }}>.in</span>
      </div>
      <p style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
        © 2024 Amazon Clone - SDE Intern Fullstack Assignment. Built with React + Node.js + PostgreSQL.
      </p>
    </div>
  </footer>
);

export default Footer;
