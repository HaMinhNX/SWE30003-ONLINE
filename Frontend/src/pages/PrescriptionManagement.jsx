import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Check, X, Clock, User as UserIcon, Calendar, FileText, ArrowLeft } from 'lucide-react'; // Đổi tên tại đây
import { Link } from 'react-router-dom';
import { InputValidator } from '../utils/validators';
import Navbar from '../components/Navbar';
import { User } from '../models/User';
import Footer from '../components/Footer';

class PrescriptionManager {
  static loadPrescriptions() {
    try {
      const stored = localStorage.getItem('prescriptions');
      if (!stored) {
        return this.getMockPrescriptions();
      }
      const prescriptions = JSON.parse(stored);
      return Array.isArray(prescriptions) ? prescriptions : this.getMockPrescriptions();
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      return this.getMockPrescriptions();
    }
  }

  static getMockPrescriptions() {
    return [
      {
        id: 1,
        patientId: 'patient1@example.com',
        patient: { name: 'Nguyễn Văn A', email: 'patient1@example.com', age: 35 },
        doctorName: 'Bác sĩ Nguyễn',
        items: [
          {
            medicine: { name: 'Paracetamol 500mg', type: 'Viên nén' },
            dosage: '500mg',
            quantity: 20,
            instructions: 'Uống 1 viên khi sốt, tối đa 4 viên/ngày',
          },
        ],
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        patientId: 'patient2@example.com',
        patient: { name: 'Trần Thị B', email: 'patient2@example.com', age: 28 },
        doctorName: 'Bác sĩ Trần',
        items: [
          {
            medicine: { name: 'Amoxicillin 250mg', type: 'Viên nang' },
            dosage: '250mg',
            quantity: 21,
            instructions: 'Uống 1 viên, 3 lần/ngày sau ăn',
          },
        ],
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  static updatePrescriptionStatus(prescriptions, id, status) {
    try {
      InputValidator.validateRequired(id, 'Prescription ID');
      InputValidator.validateRequired(status, 'Status');

      const updated = prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, status } : prescription
      );

      localStorage.setItem('prescriptions', JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  }

  static filterByStatus(prescriptions, status) {
    return prescriptions.filter((p) => p.status === status);
  }
}

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = User.fromStorage();
    console.log('Current user:', user);

    if (!user) {
      setError('Vui lòng đăng nhập để truy cập trang này');
      setLoading(false);
      return;
    }

    const allowedRoles = ['Pharmacist', 'Admin', 'Manager'];
    if (!allowedRoles.includes(user.role)) {
      setError('Bạn không có quyền truy cập trang này');
      setLoading(false);
      return;
    }

    setCurrentUser(user);

    try {
      // const loadedPrescriptions = PrescriptionManager.loadPrescriptions();
      const loadPrescriptions = async () => {
        const res = await fetch('http://localhost:5000/api/prescriptions');
        const data = await res.json();
        setPrescriptions(data);
      };

      loadPrescriptions();

      // console.log('Loaded prescriptions:', loadedPrescriptions);
      // setPrescriptions(loadedPrescriptions);
    } catch (err) {
      setError('Có lỗi khi tải dữ liệu đơn thuốc');
      console.error('Error loading prescriptions:', err);
    }

    setLoading(false);
  }, []);

  // const updatePrescriptionStatus = async (id, status) => {
  //   try {
  //     const updated = PrescriptionManager.updatePrescriptionStatus(prescriptions, id, status);
  //     setPrescriptions(updated);
  //     setError('');
  //   } catch (err) {
  //     setError('Có lỗi khi cập nhật trạng thái đơn thuốc');
  //     console.error('Error updating prescription:', err);
  //   }
  // };

  const updatePrescriptionStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/prescriptions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn thuốc');
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <X className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderPrescriptionItem = (item, index) => {
    const productName = item.medicine?.name || item.name || 'Tên sản phẩm không xác định';
    const productType = item.medicine?.type || item.category || 'Loại sản phẩm không xác định';
    const dosage = item.dosage || 'Không có thông tin';
    const quantity = item.quantity || 0;
    const instructions = item.instructions || 'Không có hướng dẫn';

    return (
      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="font-medium">{productName}</div>
          <div className="text-sm text-gray-500">{productType}</div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Liều dùng:</span> {dosage} |
            <span className="font-medium"> Số lượng:</span> {quantity} |
            <span className="font-medium"> Cách dùng:</span> {instructions}
          </div>
        </div>
      </div>
    );
  };

  const renderApprovedItem = (item, index) => {
    const productName = item.medicine?.name || item.name || 'Tên sản phẩm không xác định';
    const productType = item.medicine?.type || item.category || 'Loại sản phẩm không xác định';
    const dosage = item.dosage || 'Không có thông tin';
    const quantity = item.quantity || 0;
    const instructions = item.instructions || 'Không có hướng dẫn';

    return (
      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex-1">
          <div className="font-medium">{productName}</div>
          <div className="text-sm text-gray-500">{productType}</div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Liều dùng:</span> {dosage} |
            <span className="font-medium"> Số lượng:</span> {quantity} |
            <span className="font-medium"> Cách dùng:</span> {instructions}
          </div>
        </div>
      </div>
    );
  };

  const renderRejectedItem = (item, index) => {
    const productName = item.medicine?.name || item.name || 'Tên sản phẩm không xác định';
    const productType = item.medicine?.type || item.category || 'Loại sản phẩm không xác định';
    const dosage = item.dosage || 'Không có thông tin';
    const quantity = item.quantity || 0;
    const instructions = item.instructions || 'Không có hướng dẫn';

    return (
      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
        <div className="flex-1">
          <div className="font-medium">{productName}</div>
          <div className="text-sm text-gray-500">{productType}</div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Liều dùng:</span> {dosage} |
            <span className="font-medium"> Số lượng:</span> {quantity} |
            <span className="font-medium"> Cách dùng:</span> {instructions}
          </div>
        </div>
      </div>
    );
  };

  const pendingPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'pending');
  const approvedPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'approved');
  const rejectedPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải...</h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
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
              <X className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi truy cập</h3>
              <p className="text-red-600">{error}</p>
              <div className="mt-4 space-x-2">
                <Button asChild>
                  <Link to="/">Quay về trang chủ</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </div>
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn thuốc</h1>
            <p className="text-gray-600">Duyệt và quản lý đơn thuốc từ bác sĩ</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Chờ duyệt
              {pendingPrescriptions.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {pendingPrescriptions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Đã duyệt ({approvedPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="rejected">Từ chối ({rejectedPrescriptions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingPrescriptions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn thuốc chờ duyệt</h3>
                    <p className="text-gray-500">Tất cả đơn thuốc đã được xử lý</p>
                  </CardContent>
                </Card>
              ) : (
                pendingPrescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Đơn thuốc #{prescription.id}
                        </CardTitle>
                        {getStatusBadge(prescription.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          Bệnh nhân: {prescription.patient?.name || 'Không có thông tin'}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          Bác sĩ: {prescription.doctorName || 'Không có thông tin'}
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
                        <div className="space-y-2">
                          {prescription.items?.length > 0 ? (
                            prescription.items.map((item, index) =>
                              renderPrescriptionItem(item, index)
                            )
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                              Không có thuốc trong đơn
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => updatePrescriptionStatus(prescription.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Duyệt đơn thuốc
                        </Button>
                        <Button
                          onClick={() => updatePrescriptionStatus(prescription.id, 'rejected')}
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Từ chối đơn thuốc
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default PrescriptionManagement;
