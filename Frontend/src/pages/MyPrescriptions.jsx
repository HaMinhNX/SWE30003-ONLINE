import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ShoppingCart, Calendar, User, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserModel } from '../models/User';
import { Cart } from '../models/Cart';
import { InputValidator } from '../utils/validators';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Prescription manager class for customer operations
 */
class CustomerPrescriptionManager {
  /**
   * Get approved prescriptions for a specific patient
   */
  static getApprovedPrescriptions(patientEmail) {
    try {
      InputValidator.validateRequired(patientEmail, 'Patient email');
      
      const stored = localStorage.getItem('prescriptions');
      if (!stored) return [];
      
      const allPrescriptions = JSON.parse(stored);
      return Array.isArray(allPrescriptions) 
        ? allPrescriptions.filter((p) => 
            p.status === 'approved' && 
            (p.patient?.email === patientEmail || p.patientId === patientEmail)
          )
        : [];
    } catch (error) {
      console.error('Error loading customer prescriptions:', error);
      return [];
    }
  }

  /**
   * Convert prescription items to cart items
   */
  static convertToCartItems(items) {
    return items.map((item, index) => ({
      id: item.id || item.medicine?.id || Date.now() + index,
      name: item.medicine?.name || item.name || 'Sản phẩm không xác định',
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: '/placeholder.svg',
      category: item.medicine?.type || item.category || 'Thuốc'
    })).filter(item => item.name !== 'Sản phẩm không xác định');
  }
}

const MyPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = UserModel.fromStorage();
    
    if (!user) {
      setError('Vui lòng đăng nhập để xem đơn thuốc');
      setLoading(false);
      return;
    }

    // Only customers can view their prescriptions
    if (user.role !== 'Customer') {
      setError('Chỉ bệnh nhân mới có thể xem đơn thuốc của mình');
      setLoading(false);
      return;
    }

    setCurrentUser(user);

    try {
      const userPrescriptions = CustomerPrescriptionManager.getApprovedPrescriptions(user.email);
      console.log('Customer prescriptions:', userPrescriptions);
      setPrescriptions(userPrescriptions);
    } catch (err) {
      setError('Có lỗi khi tải đơn thuốc');
      console.error('Error loading prescriptions:', err);
    }
    
    setLoading(false);
  }, []);

  const handleOrderPrescription = (prescription) => {
    try {
      if (!currentUser) return;

      const cartItems = CustomerPrescriptionManager.convertToCartItems(prescription.items);
      
      if (cartItems.length === 0) {
        alert('Đơn thuốc này không có sản phẩm hợp lệ để đặt mua');
        return;
      }

      // Add items to cart
      cartItems.forEach(item => {
        Cart.addItem(currentUser.email, item);
      });

      // Navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error adding prescription to cart:', error);
      alert('Có lỗi khi thêm đơn thuốc vào giỏ hàng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải đơn thuốc...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi truy cập</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button asChild>
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </CardContent>
          </Card>
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Đơn thuốc của tôi</h1>
            <p className="text-gray-600">Xem các đơn thuốc đã được duyệt và đặt mua thuốc</p>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn thuốc nào</h3>
                <p className="text-gray-500 mb-4">Bạn chưa có đơn thuốc nào được duyệt</p>
                <Button asChild>
                  <Link to="/prescription">Tạo đơn thuốc mới</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            prescriptions.map((prescription) => (
              <Card key={prescription.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Đơn thuốc #{prescription.id}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Đã duyệt
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Bác sĩ: {prescription.doctorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(prescription.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Danh sách thuốc:</h4>
                    <div className="space-y-3">
                      {prescription.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {item.medicine?.name || item.name || 'Tên thuốc không xác định'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.medicine?.type || item.category || 'Loại thuốc không xác định'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Liều dùng:</span> {item.dosage} | 
                              <span className="font-medium"> Số lượng:</span> {item.quantity} | 
                              <span className="font-medium"> Cách dùng:</span> {item.instructions}
                            </div>
                            {item.price && (
                              <div className="text-sm font-medium text-green-600 mt-1">
                                Giá: {formatPrice(item.price * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleOrderPrescription(prescription)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Đặt mua thuốc
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyPrescriptions;
