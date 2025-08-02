import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Package, Calendar, User, MapPin, CreditCard, ArrowLeft, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o) => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPaymentMethodText = (method) => {
    return method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua thẻ tín dụng';
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-8">Xin lỗi, chúng tôi không tìm thấy thông tin đơn hàng</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/">
                Quay lại trang chủ
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header thành công */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua hàng tại Long Châu. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin đơn hàng */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chi tiết đơn hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Chi tiết đơn hàng
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Đang xử lý
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl">📦</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Số lượng: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Thông tin khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Họ và tên</div>
                    <div className="text-gray-900">{order.customerInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Số điện thoại</div>
                    <div className="text-gray-900">{order.customerInfo.phone}</div>
                  </div>
                  {order.customerInfo.email && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="text-gray-900">{order.customerInfo.email}</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ giao hàng
                  </div>
                  <div className="text-gray-900">
                    {order.customerInfo.address}
                    {order.customerInfo.district && `, ${order.customerInfo.district}`}
                    {order.customerInfo.city && `, ${order.customerInfo.city}`}
                  </div>
                </div>

                {order.customerInfo.note && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Ghi chú</div>
                    <div className="text-gray-900">{order.customerInfo.note}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tóm tắt thanh toán */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng sản phẩm</span>
                    <span className="font-medium">{order.items.length} sản phẩm</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-500">Phương thức thanh toán</span>
                    </div>
                    <div className="text-gray-900">{getPaymentMethodText(order.paymentMethod)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Tải hóa đơn
                    </Button>
                    
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link to="/order-history">
                        Xem lịch sử đơn hàng
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/products">
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 mb-2">Cần hỗ trợ?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
                    </p>
                    <div className="text-sm">
                      <div className="text-primary font-medium">Hotline: 1800 6928</div>
                      <div className="text-gray-600">Email: support@longchau.com</div>
                    </div>
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

export default PaymentSuccess;
