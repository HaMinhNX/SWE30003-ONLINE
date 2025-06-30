import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ file JSON
    fetch('/assets/data.json') // Đảm bảo đường dẫn đúng
      .then(response => response.json())
      .then(data => {
        setOrders(data.orders);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'bg-purple-100 text-purple-800',
        };
      case 'delivered':
        return {
          label: 'Đã giao hàng',
          color: 'bg-green-100 text-green-800',
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-800',
        };
      default:
        return {
          label: 'Không xác định',
          color: 'bg-gray-100 text-gray-800',
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 text-gray-300 mx-auto mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bạn chưa đăng nhập</h2>
            <p className="text-gray-600 mb-8">Vui lòng đăng nhập để xem lịch sử mua hàng</p>
            <button className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg text-white">
              <Link to="/login">
                Đăng nhập
              </Link>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử mua hàng</h1>
          <p className="text-gray-600">Theo dõi các đơn hàng của bạn tại Long Châu</p>
        </div>

        {/* Tab navigation */}
        <div className="mb-8 flex gap-4">
          <button
            className={`px-4 py-2 ${selectedTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('pending')}
          >
            Chờ xác nhận
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('confirmed')}
          >
            Đã xác nhận
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'shipping' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('shipping')}
          >
            Đang giao
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'delivered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('delivered')}
          >
            Đã giao
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('cancelled')}
          >
            Đã hủy
          </button>
        </div>

        {/* Order list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 text-gray-300 mx-auto mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-600 mb-8">Bạn chưa có đơn hàng nào trong danh mục này</p>
            <button className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg text-white">
              <Link to="/products">
                Tiếp tục mua sắm
              </Link>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);

              return (
                <div key={order.id} className="border p-6 rounded-lg shadow-md hover:shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold">Đơn hàng #{order.id}</div>
                      <span className={`px-3 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Địa chỉ giao hàng</h4>
                    <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                    <h4 className="font-medium text-gray-900 mt-4">Phương thức thanh toán</h4>
                    <p className="text-gray-600 text-sm">{order.paymentMethod}</p>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sản phẩm ({order.itemCount} sản phẩm)</h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-lg text-gray-300">📦</div>
                            </div>
                            <div>
                              <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-primary">
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-500">
                                Số lượng: {item.quantity} x {formatPrice(item.price)}
                              </div>
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
                  <div className="mt-6 flex justify-between items-center">
                    <button className="text-primary hover:text-primary/70">Mua lại</button>
                    <button className="text-red-600 hover:text-red-700">Hủy đơn hàng</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
