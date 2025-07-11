import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('user');
    if (!currentUser) return;
    
    try {
      const userData = JSON.parse(currentUser);
      if (userData.isLoggedIn) {
        setUser(userData);
        
        // Get user-specific cart using email as unique identifier
        const cartKey = `cart_${userData.email}`;
        const cart = localStorage.getItem(cartKey);
        if (cart) {
          setCartItems(JSON.parse(cart));
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const updateQuantity = (id, change) => {
    if (!user) return;
    
    const cartKey = `cart_${user.email}`;
    
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    
    setCartItems(updatedItems);
    localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    
    // Trigger storage event to update navbar
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id) => {
    if (!user) return;
    
    const cartKey = `cart_${user.email}`;
    
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    
    // Trigger storage event to update navbar
    window.dispatchEvent(new Event('storage'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalOriginalPrice = () => {
    return cartItems.reduce((total, item) => 
      total + ((item.originalPrice || item.price) * item.quantity), 0
    );
  };

  const getTotalSavings = () => {
    return getTotalOriginalPrice() - getTotalPrice();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem giỏ hàng</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/login">
                Đăng nhập
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/products">
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
            <p className="text-gray-600">{getTotalItems()} sản phẩm - {user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.id}`} className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-2xl text-gray-300">📦</div>
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-primary">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Total Price and Delete */}
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mt-2">
                          Còn lại: {item.stock} sản phẩm
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính ({getTotalItems()} sản phẩm)</span>
                    <span className="font-medium">{formatPrice(getTotalOriginalPrice())}</span>
                  </div>
                  
                  {getTotalSavings() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Tiết kiệm</span>
                      <span className="font-medium">-{formatPrice(getTotalSavings())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                    <Link to="/checkout">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Tiến hành thanh toán
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-gray-900">Giao hàng nhanh</div>
                        <div className="text-sm text-gray-600">Trong vòng 2-4 giờ</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      🎉 Miễn phí giao hàng cho đơn hàng từ 200.000đ
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promotions */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Ưu đãi có thể áp dụng</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-primary border-primary">
                      FREESHIP - Miễn phí vận chuyển
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      SAVE10 - Giảm 10% đơn hàng
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
