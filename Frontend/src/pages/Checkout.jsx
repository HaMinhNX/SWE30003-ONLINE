import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: ''
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(currentUser);
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }
    
    const cartKey = `cart_${user.email}`;
    const cart = localStorage.getItem(cartKey);
    if (cart) {
      setCartItems(JSON.parse(cart));
    } else {
      navigate('/cart');
    }

    if (user.isLoggedIn) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const order = {
      id: Date.now(),
      items: cartItems,
      customerInfo,
      paymentMethod,
      totalAmount: getTotalPrice(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    if (paymentMethod === 'stripe') {
      alert('Thanh toán đã được xử lý thành công!');
      setTimeout(() => {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const cartKey = `cart_${userData.email}`;
          localStorage.removeItem(cartKey);
        }
        navigate('/payment-success', { state: { orderId: order.id } });
      }, 1000);
    } else {
      alert('Đơn hàng đã được xác nhận! Bạn sẽ thanh toán khi nhận hàng.');
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        const cartKey = `cart_${userData.email}`;
        localStorage.removeItem(cartKey);
      }
      navigate('/payment-success', { state: { orderId: order.id } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại giỏ hàng
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email (tùy chọn)"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        value={customerInfo.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Quận/Huyện"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Tỉnh/Thành phố"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="note">Ghi chú đơn hàng</Label>
                    <Input
                      id="note"
                      value={customerInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      placeholder="Ghi chú cho người giao hàng (tùy chọn)"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Thanh toán khi nhận hàng</div>
                            <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Thanh toán qua thẻ tín dụng</div>
                            <div className="text-sm text-gray-500">Thanh toán an toàn với Visa, Mastercard</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="text-xs text-gray-400">📦</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{item.name}</div>
                            <div className="text-sm text-gray-500">SL: {item.quantity}</div>
                          </div>
                          <div className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Phí vận chuyển</span>
                        <span className="text-green-600">Miễn phí</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                      {paymentMethod === 'stripe' ? 'Thanh toán ngay' : 'Đặt hàng'}
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      Bằng việc đặt hàng, bạn đồng ý với{' '}
                      <Link to="#" className="text-primary hover:underline">
                        Điều khoản sử dụng
                      </Link>{' '}
                      của chúng tôi.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
