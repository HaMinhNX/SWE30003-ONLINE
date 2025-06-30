import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Products.css'; // Đảm bảo bạn đã import CSS cho Products

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Lấy dữ liệu từ file JSON trong thư mục public
  useEffect(() => {
    fetch('/assets/data.json')  // Đảm bảo đúng đường dẫn
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        image: product.image,
        stock: product.stock,
        category: product.category,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger storage event để cập nhật navbar
    window.dispatchEvent(new Event('storage'));

    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="products-page">
      <div className="filter-container">
        {/* Search */}
        <div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm"
            className="search-input"
          />
        </div>

        {/* Filter */}
        <div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">Tất cả</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label>
            Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </label>
          <input
            type="range"
            min="0"
            max="500000"
            step="10000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          />
          <input
            type="range"
            min="0"
            max="500000"
            step="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          />
        </div>

        {/* Sort */}
        <div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Tên A-Z</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {sortedProducts.length === 0 ? (
          <div className="no-products">
            <p>Không có sản phẩm nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
              </div>

              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-rating">
                  <span>{product.rating}</span>
                </div>
                <div className="product-price">
                  <span>{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="product-stock">Còn lại: {product.stock}</div>
              </div>

              <div className="product-footer">
                <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
