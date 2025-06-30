import React from 'react';
import '../style/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-subtitle">Hệ thống nhà thuốc uy tín #1 Việt Nam</div>
            <h1 className="hero-title">
              <span className="highlight">Long Châu</span>
              <br />
              Chăm sóc sức khỏe toàn diện
            </h1>
            <p className="hero-description">
              Hệ thống quản lý nhà thuốc hiện đại với hơn 1000+ sản phẩm chính hãng, 
              đội ngũ dược sĩ chuyên nghiệp và dịch vụ tư vấn 24/7.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="featured-products-section">
        <div className="section-header">
          <h2 className="section-title">
            Sản phẩm <span className="highlight">bán chạy</span>
          </h2>
          <p className="section-description">
            Các sản phẩm được tin dùng và lựa chọn nhiều nhất bởi khách hàng Long Châu
          </p>
        </div>
        <div className="products-grid">
          {/* Example Product */}
          <div className="product-card">
            <div className="product-image">
              <div className="text-placeholder">📦</div>
            </div>
            <div className="product-info">
              <h3 className="product-title">Paracetamol 500mg</h3>
              <p className="product-category">Thuốc giảm đau</p>
              <div className="product-rating">
                <span className="rating">⭐⭐⭐⭐☆</span> (156 reviews)
              </div>
              <div className="product-price">25,000 VND</div>
            </div>
            <div className="product-footer">
              <Link to="/product/1" className="btn-view-details">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
        <div className="view-all-btn">
          <Link to="/products" className="btn-view-all">Xem tất cả sản phẩm</Link>
        </div>
      </div>

      {/* Store Locator Section */}
      <div className="store-locator-section">
        <div className="section-header">
          <h2 className="section-title">
            Cửa hàng <span className="highlight">gần bạn</span>
          </h2>
          <p className="section-description">
            Tìm và đến cửa hàng Long Châu gần nhất để nhận thuốc nhanh chóng
          </p>
        </div>
        <div className="store-cards">
          {/* Example Store */}
          <div className="store-card">
            <div className="store-header">
              <h3 className="store-title">Long Châu Nguyễn Trãi</h3>
              <p className="store-status">Đang mở cửa</p>
            </div>
            <div className="store-details">
              <p className="store-address">123 Nguyễn Trãi, Quận 1, TP.HCM</p>
              <p className="store-phone">(028) 3925 1234</p>
              <p className="store-hours">Mở cửa: 7:00 - 22:00</p>
            </div>
            <div className="store-actions">
              <Link to="#" className="btn-direction">Chỉ đường</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
