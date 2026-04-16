import React from 'react';
import './Header.css';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ cartItemCount }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();
  const dropdownTimeout = React.useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <>
      <div className="header">
        <Link to="/">
          <img
            className="header__logo"
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="Amazon Logo"
          />
        </Link>

        <form className="header__search" onSubmit={handleSearch}>
          <input 
            className="header__searchInput" 
            type="text" 
            placeholder="Search Amazon.in"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="header__searchIcon">
            <Search size={22} />
          </button>
        </form>

        <div className="header__nav">
          <div 
            className="header__option header__accountDropdownTrigger"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="header__optionLineOne">Hello, Default</span>
            <span className="header__optionLineTwo">Account & Lists ▾</span>

            {showDropdown && (
              <div className="header__accountDropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="header__dropdownArrow"></div>
                <div className="header__dropdownContent">
                  <div className="header__dropdownColumn">
                    <h4>Your Account</h4>
                    <Link to="/orders" onClick={() => setShowDropdown(false)}>Your Orders</Link>
                    <Link to="/wishlist" onClick={() => setShowDropdown(false)}>Your Wish List</Link>
                    <Link to="/cart" onClick={() => setShowDropdown(false)}>Your Cart</Link>
                    <Link to="/" onClick={() => setShowDropdown(false)}>Keep Shopping</Link>
                  </div>
                  <div className="header__dropdownDivider"></div>
                  <div className="header__dropdownColumn">
                    <h4>Quick Links</h4>
                    <Link to="/?category=Electronics" onClick={() => setShowDropdown(false)}>Electronics</Link>
                    <Link to="/?category=Books" onClick={() => setShowDropdown(false)}>Books</Link>
                    <Link to="/?category=Home" onClick={() => setShowDropdown(false)}>Home</Link>
                    <Link to="/?category=Clothing" onClick={() => setShowDropdown(false)}>Clothing</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/orders" style={{color: 'white', textDecoration: 'none'}}>
            <div className="header__option">
              <span className="header__optionLineOne">Returns</span>
              <span className="header__optionLineTwo">& Orders</span>
            </div>
          </Link>

          <Link to="/cart" style={{color: 'white', textDecoration: 'none'}}>
            <div className="header__optionBasket">
              <ShoppingCart size={32} />
              <span className="header__optionLineTwo header__basketCount">
                {cartItemCount || 0}
              </span>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="subheader">
        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Menu size={18} /> All</span>
        <span>Today's Deals</span>
        <span>Customer Service</span>
        <span>Registry</span>
        <span>Gift Cards</span>
        <span>Sell</span>
      </div>
    </>
  );
}

export default Header;
