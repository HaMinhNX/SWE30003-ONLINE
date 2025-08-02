import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderHistory = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initializeUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user.isLoggedIn || !user.email) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        setCurrentUser(user);
        fetchOrders(user.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setCurrentUser(null);
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const fetchOrders = async (email) => {
    if (!email) {
      setError('Email không hợp lệ');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Fetching orders for email:', email);

      const response = await fetch(`http://localhost:5000/api/orderHistory/history?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          setOrders([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        // Ensure orders is always an array
        const ordersData = Array.isArray(result.orders) ? result.orders : [];

        // Process and validate order data
        const processedOrders = ordersData.map(order => ({
          ...order,
          id: order.id || 'unknown',
          items: Array.isArray(order.items) ? order.items : [],
          total_amount: parseFloat(order.total_amount) || 0,
          created_at: order.created_at || new Date().toISOString(),
          status: order.status || 'pending',
          customer_name: order.customer_name || 'N/A',
          phone: order.phone || 'N/A',
          address: order.address || 'N/A',
          district: order.district || '',
          city: order.city || '',
          note: order.note || '',
          payment_method: order.payment_method || 'cod'
        }));

        setOrders(processedOrders);
        console.log('Processed orders:', processedOrders);
      } else {
        throw new Error(result.message || 'Failed to fetch orders');
      }

    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(`Có lỗi khi tải lịch sử đơn hàng: ${error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentUser && currentUser.email) {
      fetchOrders(currentUser.email);
    } else {
      setError('Không thể làm mới: Thông tin người dùng không hợp lệ');
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ngày không hợp lệ';
    }
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
          icon: AlertCircle
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  const getOrderCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const handleReorder = async (order) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt lại hàng');
      return;
    }

    try {
      const cartKey = `cart_${currentUser.email}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');

      // Convert order items to cart format
      const cartItems = order.items.map(item => ({
        id: item.product_id || item.id || Date.now() + Math.random(),
        name: item.name || item.product_name || 'Sản phẩm',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        category: item.category || 'Sản phẩm',
        image: item.image || '/placeholder.svg'
      }));

      // Merge with existing cart
      const updatedCart = [...existingCart];

      cartItems.forEach(newItem => {
        const existingIndex = updatedCart.findIndex(item => item.id === newItem.id);
        if (existingIndex >= 0) {
          updatedCart[existingIndex].quantity += newItem.quantity;
        } else {
          updatedCart.push(newItem);
        }
      });

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      // Trigger storage event to update navbar
      window.dispatchEvent(new Event('storage'));

      alert(`Đã thêm ${cartItems.length} sản phẩm vào giỏ hàng!`);

    } catch (error) {
      console.error('Error reordering:', error);
      alert('Có lỗi khi thêm sản phẩm vào giỏ hàng: ' + error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel order');
      }

      if (result.success) {
        alert('Đơn hàng đã được hủy thành công');
        // Refresh orders
        if (currentUser && currentUser.email) {
          fetchOrders(currentUser.email);
        }
      } else {
        throw new Error(result.message || 'Failed to cancel order');
      }

    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Có lỗi khi hủy đơn hàng: ' + error.message);
    }
  };

  // Show login prompt if user is not logged in
  if (!currentUser) {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử mua hàng</h1>
            <p className="text-gray-600">
              Theo dõi các đơn hàng của bạn tại Long Châu
              {currentUser && (
                <span className="ml-2 text-sm">({currentUser.email})</span>
              )}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={loading}
              >
                Thử lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Debug Info (remove in production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="text-blue-800 text-sm">
                <strong>Debug Info:</strong> Tìm thấy {orders.length} đơn hàng
                {currentUser && ` cho email: ${currentUser.email}`}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tất cả ({getOrderCount('all')})</TabsTrigger>
                <TabsTrigger value="pending">
                  Chờ xác nhận ({getOrderCount('pending')})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Đã xác nhận ({getOrderCount('confirmed')})
                </TabsTrigger>
                {/* <TabsTrigger value="shipping">
                  Đang giao ({getOrderCount('shipping')})
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  Đã giao ({getOrderCount('delivered')})
                </TabsTrigger> */}
                <TabsTrigger value="cancelled">
                  Đã hủy ({getOrderCount('cancelled')})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có đơn hàng nào</h3>
                <p className="text-gray-600 mb-8">
                  {selectedTab === 'all'
                    ? 'Bạn chưa có đơn hàng nào'
                    : `Bạn chưa có đơn hàng nào trong danh mục "${getStatusInfo(selectedTab).label}"`
                  }
                </p>
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
                            <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(order.total_amount)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* Order Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Thông tin giao hàng</h4>
                            <p className="text-blue-600 text-sm font-medium">Tên khách hàng: </p>
                            <p className="text-gray-600 text-sm font-medium">{order.customer_name}</p>
                            <p className="text-blue-600 text-sm font-medium">Số điện thoại: </p>
                            <p className="text-gray-600 text-sm">{order.phone}</p>
                            <p className="text-blue-600 text-sm font-medium">Địa chỉ: </p>
                            <p className="text-gray-600 text-sm">
                              {order.address}
                              {order.district && `, ${order.district}`}
                              {order.city && `, ${order.city}`}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Phương thức thanh toán</h4>
                            <p className="text-gray-600 text-sm">
                              {order.payment_method === 'cod'
                                ? 'Thanh toán khi nhận hàng'
                                : 'Thanh toán qua thẻ tín dụng'
                              }
                            </p>
                            {order.note && (
                              <>
                                <h4 className="font-medium text-gray-900 mb-1 mt-2">Ghi chú</h4>
                                <p className="text-gray-600 text-sm">{order.note}</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Product List */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Sản phẩm ({order.items?.length || 0} sản phẩm)
                          </h4>
                          <div className="space-y-3">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div key={`${order.id}-${item.id || index}`} className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <div className="text-lg text-gray-300">📦</div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {item.name || item.product_name || 'Sản phẩm'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {item.category && `${item.category} • `}
                                      Số lượng: {item.quantity} x {formatPrice(item.price)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-gray-900">
                                      {formatPrice((item.price || 0) * (item.quantity || 0))}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500 text-sm text-center py-4">
                                Không có sản phẩm
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                          <div className="flex gap-2">
                            {order.status === 'delivered' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReorder(order)}
                              >
                                Mua lại
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleCancelOrder(order.id)}
                              >
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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;