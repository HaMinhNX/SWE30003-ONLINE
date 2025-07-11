import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const product = {
    id: parseInt(id || '1'),
    name: 'Paracetamol 500mg',
    category: 'Thuốc giảm đau',
    price: 25000,
    originalPrice: 30000,
    rating: 4.8,
    reviews: 156,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    isHot: true,
    discount: 17,
    stock: 50,
    brand: 'Traphaco',
    origin: 'Việt Nam',
    description: 'Paracetamol 500mg là thuốc giảm đau, hạ sốt được sử dụng rộng rãi và an toàn cho cả người lớn và trẻ em.',
    ingredients: 'Paracetamol 500mg',
    usage: 'Người lớn: 1-2 viên/lần, 3-4 lần/ngày. Trẻ em: Theo chỉ dẫn của bác sĩ.',
    storage: 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp.',
    warnings: 'Không dùng cho người mẫn cảm với Paracetamol. Không dùng quá liều.',
    expiry: '24 tháng kể từ ngày sản xuất'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      console.log("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    
    const user = JSON.parse(currentUser);
    if (!user.isLoggedIn) {
      console.log("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    
    const cartKey = `cart_${user.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: quantity,
        image: product.images[0],
        stock: product.stock,
        category: product.category
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    console.log(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const addToWishlist = () => {
    console.log(`Thêm ${product.name} vào danh sách yêu thích`);
    // Logic thêm vào wishlist
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách sản phẩm
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <div className="text-8xl text-gray-300">📦</div>
              </div>
            </div>
            
            {/* Thumbnail images */}
            <div className="flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="text-2xl text-gray-300">📦</div>
                </button>
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isHot && (
                  <Badge className="bg-red-500 text-white">HOT</Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="bg-primary text-white">-{product.discount}%</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.category}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium text-gray-700 ml-1">{product.rating}</span>
                  <span className="text-gray-500 ml-2">({product.reviews} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Giá */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className="text-green-600 font-medium mb-4">
                Còn lại: {product.stock} sản phẩm
              </div>

              {/* Số lượng */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                  onClick={addToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ - {formatPrice(product.price * quantity)}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={addToWishlist}
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Thông tin giao hàng</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Giao hàng trong 2-4 giờ</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Sản phẩm chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="ingredients">Thành phần</TabsTrigger>
                  <TabsTrigger value="usage">Cách dùng</TabsTrigger>
                  <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h3>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thương hiệu</h4>
                        <p className="text-gray-700">{product.brand}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Xuất xứ</h4>
                        <p className="text-gray-700">{product.origin}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Hạn sử dụng</h4>
                        <p className="text-gray-700">{product.expiry}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Bảo quản</h4>
                        <p className="text-gray-700">{product.storage}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ingredients" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Thành phần</h3>
                  <p className="text-gray-700">{product.ingredients}</p>
                </TabsContent>
                
                <TabsContent value="usage" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Cách sử dụng</h3>
                  <p className="text-gray-700 mb-4">{product.usage}</p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Lưu ý quan trọng</h4>
                    <p className="text-yellow-700">{product.warnings}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Đánh giá từ khách hàng</h3>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">Khách hàng {index + 1}</span>
                          <span className="text-sm text-gray-500">2 ngày trước</span>
                        </div>
                        <p className="text-gray-700">
                          Sản phẩm chất lượng tốt, giao hàng nhanh chóng. Tôi sẽ mua lại lần sau.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
