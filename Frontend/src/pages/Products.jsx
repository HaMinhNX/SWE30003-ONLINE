import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Search, Filter, ShoppingCart, Star, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PrescriptionPopup from '../components/PrescriptionPopup';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('name');
  const [user, setUser] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [showPrescriptionPopup, setShowPrescriptionPopup] = useState(false);

  const canPrescribe = user && (user.role === 'Doctor' || user.role === 'Admin');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isLoggedIn) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      currency: 'VND'
    }).format(price);
  };

  const addToCart = (product) => {
    if (!user || !user.isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    
    const cartKey = `cart_${user.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
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
        category: product.category
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const addToPrescription = (product) => {
    const existingItem = prescriptionItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = prescriptionItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setPrescriptionItems(updatedItems);
    } else {
      setPrescriptionItems([...prescriptionItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      }]);
    }
    
    setShowPrescriptionPopup(true);
    alert(`Đã thêm ${product.name} vào đơn thuốc!`);
  };

  const handlePrescriptionSent = () => {
    setPrescriptionItems([]);
    setShowPrescriptionPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trang chủ
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {canPrescribe ? 'Kê đơn thuốc' : 'Sản phẩm'}
            </h1>
            <p className="text-gray-600">
              {canPrescribe 
                ? 'Chọn thuốc và tạo đơn thuốc cho bệnh nhân' 
                : 'Tìm kiếm và mua sắm các sản phẩm y tế chất lượng'
              }
            </p>
          </div>
          
          {canPrescribe && prescriptionItems.length > 0 && (
            <Button 
              onClick={() => setShowPrescriptionPopup(!showPrescriptionPopup)}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Đơn thuốc ({prescriptionItems.length})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter size={20} />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tìm kiếm sản phẩm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nhập tên sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Danh mục
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">Tất cả</SelectItem>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500000}
                    min={0}
                    step={10000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sắp xếp theo
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="name">Tên A-Z</SelectItem>
                      <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Hiển thị {sortedProducts.length} sản phẩm
              </p>
            </div>

            {sortedProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        <div className="text-6xl text-gray-300">📦</div>
                        {product.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            Giảm giá
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <CardTitle className="text-lg mb-2 hover:text-primary line-clamp-2">
                          {product.name}
                        </CardTitle>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-3">
                        Còn lại: {product.stock} sản phẩm
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex gap-2 w-full">
                        {canPrescribe ? (
                          <Button
                            onClick={() => addToPrescription(product)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={product.stock === 0}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào đơn'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link to={`/product/${product.id}`}>
                            Chi tiết
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PrescriptionPopup
        isVisible={showPrescriptionPopup}
        onClose={() => setShowPrescriptionPopup(false)}
        prescriptionItems={prescriptionItems}
        onSendPrescription={handlePrescriptionSent}
      />

      <Footer />
    </div>
  );
};

export default Products;
