import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderHistory = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const orders = [
    {
      id: 'LC202501001',
      date: '2025-01-20',
      status: 'delivered',
      total: 205000,
      itemCount: 3,
      items: [
        { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 25000, image: '/placeholder.svg' },
        { id: 2, name: 'Vitamin C 1000mg', quantity: 1, price: 150000, image: '/placeholder.svg' },
        { id: 5, name: 'Gel rửa tay khô', quantity: 1, price: 35000, image: '/placeholder.svg' }
      ],
      shippingAddress: '123 Nguyễn Trãi, Quận 1, TP.HCM',
      paymentMethod: 'Thanh toán khi nhận hàng'
    },
    {
      id: 'LC202501002',
      date: '2025-01-22',
      status: 'shipping',
      total: 320000,
      itemCount: 1,
      items: [
        { id: 3, name: 'Omega-3 Fish Oil', quantity: 1, price: 320000, image: '/placeholder.svg' }
      ],
      shippingAddress: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
      paymentMethod: 'Thẻ tín dụng'
    },
    {
      id: 'LC202501003',
      date: '2025-01-25',
      status: 'confirmed',
      total: 1200000,
      itemCount: 1,
      items: [
        { id: 6, name: 'Máy đo huyết áp Omron', quantity: 1, price: 1200000, image: '/placeholder.svg' }
      ],
      shippingAddress: '789 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      paymentMethod: 'Thẻ tín dụng'
    },
    {
      id: 'LC202501004',
      date: '2025-01-26',
      status: 'pending',
      total: 95000,
      itemCount: 2,
      items: [
        { id: 4, name: 'Thuốc ho Bảo Thanh', quantity: 1, price: 45000, image: '/placeholder.svg' },
        { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 25000, image: '/placeholder.svg' }
      ],
      shippingAddress: '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      paymentMethod: 'Thanh toán khi nhận hàng'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'bg-purple-100 text-purple-800',
          icon: Truck
        };
      case 'delivered':
        return {
          label: 'Đã giao hàng',
          color: 'bg-green-100 text-green-800',
          icon: Package
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return {
          label: 'Không xác định',
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  // Kiểm tra đăng nhập
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bạn chưa đăng nhập</h2>
            <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem lịch sử mua hàng</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử mua hàng</h1>
          <p className="text-gray-600">Theo dõi các đơn hàng của bạn tại Long Châu</p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
            <TabsTrigger value="shipping">Đang giao</TabsTrigger>
            <TabsTrigger value="delivered">Đã giao</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Danh sách đơn hàng */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-600 mb-8">Bạn chưa có đơn hàng nào trong danh mục này</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/products">
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(order.total)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Thông tin đơn hàng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Địa chỉ giao hàng</h4>
                        <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Phương thức thanh toán</h4>
                        <p className="text-gray-600 text-sm">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Sản phẩm ({order.itemCount} sản phẩm)
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <div className="text-lg text-gray-300">📦</div>
                            </div>
                            <div className="flex-1">
                              <Link 
                                to={`/product/${item.id}`}
                                className="font-medium text-gray-900 hover:text-primary"
                              >
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-500">
                                Số lượng: {item.quantity} x {formatPrice(item.price)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="flex gap-2">
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Mua lại
                          </Button>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            Hủy đơn hàng
                          </Button>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
