import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';  // Đảm bảo CSS được import đúng

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-text">LC</div>
          <span className="navbar-logo-name">Long Châu</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop">
          <Link to="/" className="navbar-link">Trang chủ</Link>
          <Link to="/products" className="navbar-link">Sản phẩm</Link>
          <Link to="/order-history" className="navbar-link">Lịch sử</Link>
        </div>

        {/* Auth Section (Login/Register) */}
        <div className="navbar-auth desktop">
          <Link to="/login" className="navbar-auth-link">Đăng nhập</Link>
          <Link to="/register" className="navbar-auth-link">Đăng ký</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-mobile-menu" onClick={toggleMobileMenu}>
          {isOpen ? 'X' : 'Menu'}
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="navbar-links mobile">
            <Link to="/" className="navbar-link" onClick={toggleMobileMenu}>Trang chủ</Link>
            <Link to="/products" className="navbar-link" onClick={toggleMobileMenu}>Sản phẩm</Link>
            <Link to="/order-history" className="navbar-link" onClick={toggleMobileMenu}>Lịch sử</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
