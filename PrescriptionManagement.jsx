//PrescriptionManagement.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Check, X, Clock, User as UserIcon, Calendar, FileText, ArrowLeft, Package, Tag, Building, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InputValidator } from '../utils/validators';
import Navbar from '../components/Navbar';
import { User } from '../models/User';
import Footer from '../components/Footer';

class PrescriptionManager {
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

        const loadPrescriptions = async () => {
            try {
                console.log('Fetching prescriptions...');
                const res = await fetch('http://localhost:5000/api/prescriptions');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log('Loaded prescriptions:', data);

                // Ensure data is an array
                if (Array.isArray(data)) {
                    setPrescriptions(data);
                } else {
                    console.error('Expected array but got:', typeof data, data);
                    setPrescriptions([]);
                    setError('Dữ liệu không hợp lệ từ máy chủ');
                }
            } catch (err) {
                console.error('Error loading prescriptions:', err);
                setError('Có lỗi khi tải dữ liệu đơn thuốc: ' + err.message);
                setPrescriptions([]);
            }
        };

        loadPrescriptions();
        setLoading(false);
    }, []);

    const updatePrescriptionStatus = async (id, status) => {
        try {
            console.log(`Updating prescription ${id} to status ${status}`);

            const res = await fetch(`http://localhost:5000/api/prescriptions/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log('Update result:', result);

            if (result.success) {
                // Update local state
                setPrescriptions((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status } : p))
                );
                setError(''); // Clear any previous errors
                console.log(`Successfully updated prescription ${id} to ${status}`);
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error updating prescription status:', err);
            setError('Không thể cập nhật trạng thái đơn thuốc: ' + err.message);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
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
                return (
                    <Badge variant="outline" className="text-gray-600 border-gray-600">
                        Không xác định
                    </Badge>
                );
        }
    };

    const calculatePrescriptionTotal = (items) => {
        return items.reduce((total, item) => {
            const price = item.unit_price || item.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const renderMedicineItem = (item, index) => {
        const medicineName = item.medicine?.name || item.medicine_name || item.name || 'Tên thuốc không xác định';
        const medicineType = item.medicine?.type || item.type || item.category || 'Loại thuốc không xác định';
        const brand = item.medicine?.brand || item.brand;
        const description = item.medicine?.description || item.description;
        const unitPrice = item.unit_price || item.price || 0;
        const originalPrice = item.original_price;
        const quantity = item.quantity || 0;
        const totalPrice = item.total_price || (unitPrice * quantity);
        const dosage = item.dosage || 'Không có thông tin';
        const instructions = item.instructions || 'Không có hướng dẫn';

        return (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-lg">{medicineName}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span><strong>Loại:</strong> {medicineType}</span>
                            </div>
                            {brand && (
                                <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    <span><strong>Thương hiệu:</strong> {brand}</span>
                                </div>
                            )}
                        </div>

                        {description && (
                            <p className="text-sm text-gray-600 mb-2 italic">{description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                            <div>
                                <span className="font-medium">Liều dùng:</span> {dosage}
                            </div>
                            <div>
                                <span className="font-medium">Số lượng:</span> {quantity}
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 mb-3">
                            <span className="font-medium">Cách dùng:</span> {instructions}
                        </div>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="border-t border-blue-300 pt-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <span className="text-gray-600">Đơn giá: </span>
                                <span className="font-semibold text-blue-700">{formatPrice(unitPrice)}</span>
                                {originalPrice && originalPrice > unitPrice && (
                                    <span className="ml-2 text-gray-500 line-through text-xs">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>
                            {originalPrice && originalPrice > unitPrice && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                    Giảm {Math.round(((originalPrice - unitPrice) / originalPrice) * 100)}%
                                </Badge>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                                {formatPrice(totalPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                                ({quantity} x {formatPrice(unitPrice)})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPrescriptionCard = (prescription) => {
        const totalValue = calculatePrescriptionTotal(prescription.items || []);
        const patientName = prescription.patient?.name || prescription.patientId || 'Không có thông tin';
        const patientEmail = prescription.patient?.email || prescription.patientId || '';
        const doctorName = prescription.doctorName || prescription.doctor_name || 'Không có thông tin';
        const createdAt = prescription.createdAt || prescription.created_at;

        return (
            <Card key={prescription.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Đơn thuốc #{prescription.id}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(prescription.status)}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {formatPrice(totalValue)}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Bệnh nhân: {patientName}
                            {patientEmail && (
                                <span className="text-xs text-gray-400">({patientEmail})</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Bác sĩ: {doctorName}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {prescription.items?.length || 0} loại thuốc
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Danh sách thuốc:
                        </h4>
                        <div className="space-y-3">
                            {prescription.items && prescription.items.length > 0 ? (
                                prescription.items.map((item, index) => renderMedicineItem(item, index))
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                                    Không có thuốc trong đơn
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {prescription.items && prescription.items.length > 0 && (
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-blue-900">Tóm tắt đơn thuốc</h4>
                                    <p className="text-sm text-blue-800">
                                        Tổng cộng {prescription.items.length} loại thuốc
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-700">
                                        {formatPrice(totalValue)}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        Tổng giá trị đơn thuốc
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action buttons for pending prescriptions */}
                    {prescription.status === 'pending' && (
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
                                variant="destructive"
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Từ chối
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
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
                            <div className="space-x-2">
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

    const pendingPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'pending');
    const approvedPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'approved');
    const rejectedPrescriptions = PrescriptionManager.filterByStatus(prescriptions, 'rejected');

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
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn thuốc</h1>
                        <p className="text-gray-600">Duyệt và quản lý các đơn thuốc từ bác sĩ</p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingPrescriptions.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-6">
                            <Check className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                                <p className="text-2xl font-bold text-green-600">{approvedPrescriptions.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-6">
                            <X className="h-8 w-8 text-red-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Từ chối</p>
                                <p className="text-2xl font-bold text-red-600">{rejectedPrescriptions.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-6">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
                                <p className="text-2xl font-bold text-blue-600">{prescriptions.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different prescription statuses */}
                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="pending" className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Chờ duyệt ({pendingPrescriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Đã duyệt ({approvedPrescriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Từ chối ({rejectedPrescriptions.length})
                        </TabsTrigger>
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Tất cả ({prescriptions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-6">
                        {pendingPrescriptions.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn thuốc chờ duyệt</h3>
                                    <p className="text-gray-500">Tất cả đơn thuốc đã được xử lý.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            pendingPrescriptions.map(renderPrescriptionCard)
                        )}
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-6">
                        {approvedPrescriptions.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Check className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn thuốc được duyệt</h3>
                                    <p className="text-gray-500">Các đơn thuốc được duyệt sẽ hiển thị tại đây.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            approvedPrescriptions.map(renderPrescriptionCard)
                        )}
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-6">
                        {rejectedPrescriptions.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <X className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn thuốc bị từ chối</h3>
                                    <p className="text-gray-500">Các đơn thuốc bị từ chối sẽ hiển thị tại đây.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            rejectedPrescriptions.map(renderPrescriptionCard)
                        )}
                    </TabsContent>

                    <TabsContent value="all" className="space-y-6">
                        {prescriptions.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn thuốc nào</h3>
                                    <p className="text-gray-500">Các đơn thuốc từ bác sĩ sẽ hiển thị tại đây.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            prescriptions.map(renderPrescriptionCard)
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
};

export default PrescriptionManagement;