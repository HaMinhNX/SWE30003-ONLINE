import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ShoppingCart, Calendar, User, FileText, Package, Tag, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserModel } from '../models/User';
import { Cart } from '../models/Cart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Prescription manager class for customer operations
 */
class CustomerPrescriptionManager {
    /**
     * Convert prescription items to cart items with exact pricing
     */
    static convertToCartItems(items) {
        return items.map((item, index) => ({
            id: item.id || item.medicine?.id || Date.now() + index,
            name: item.medicine?.name || item.medicine_name || item.name || 'Sản phẩm không xác định',
            price: item.price || item.unit_price || 0, // Use exact price from prescription
            quantity: item.quantity || 1,
            image: '/placeholder.svg',
            category: item.medicine?.type || item.type || item.category || 'Thuốc',
            brand: item.medicine?.brand || item.brand,
            description: item.medicine?.description || item.description,
            original_price: item.original_price
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
        const initializeComponent = async () => {
            // First, validate the user
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

            // Now fetch prescriptions from API
            try {
                console.log('Fetching prescriptions for user:', user.email);

                const response = await fetch(`http://localhost:5000/api/prescriptions?email=${user.email}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Raw prescription data:', data);

                // Filter only approved prescriptions
                const approvedPrescriptions = Array.isArray(data)
                    ? data.filter(prescription => prescription.status === 'approved')
                    : [];

                console.log('Approved prescriptions:', approvedPrescriptions);
                setPrescriptions(approvedPrescriptions);

            } catch (err) {
                console.error('Error fetching prescriptions:', err);
                setError('Có lỗi khi tải đơn thuốc: ' + err.message);
            }

            setLoading(false);
        };

        initializeComponent();
    }, []);

    const handleOrderPrescription = (prescription) => {
        try {
            if (!currentUser) {
                alert('Vui lòng đăng nhập để đặt mua thuốc');
                return;
            }

            const cartItems = CustomerPrescriptionManager.convertToCartItems(prescription.items);

            if (cartItems.length === 0) {
                alert('Đơn thuốc này không có sản phẩm hợp lệ để đặt mua');
                return;
            }

            console.log('Adding items to cart:', cartItems);

            // Add items to cart
            cartItems.forEach(item => {
                Cart.addItem(currentUser.email, item);
            });

            const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Đã thêm ${cartItems.length} sản phẩm vào giỏ hàng!\nTổng giá trị: ${formatPrice(totalValue)}`);

            // Navigate to cart
            navigate('/cart');
        } catch (error) {
            console.error('Error adding prescription to cart:', error);
            alert('Có lỗi khi thêm đơn thuốc vào giỏ hàng: ' + error.message);
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
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Chờ duyệt
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Đã duyệt
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        Bị từ chối
                    </Badge>
                );
            default:
                return null;
        }
    };

    const calculatePrescriptionTotal = (items) => {
        return items.reduce((total, item) => {
            const price = item.price || item.unit_price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const renderMedicineItem = (item, index) => {
        const medicineName = item.medicine?.name || item.medicine_name || item.name || 'Tên thuốc không xác định';
        const medicineType = item.medicine?.type || item.type || item.category || 'Loại thuốc không xác định';
        const brand = item.medicine?.brand || item.brand;
        const description = item.medicine?.description || item.description;
        const unitPrice = item.price || item.unit_price || 0;
        const originalPrice = item.original_price;
        const quantity = item.quantity || 0;
        const totalPrice = unitPrice * quantity;
        const dosage = item.dosage || 'Không có thông tin';
        const instructions = item.instructions || 'Không có hướng dẫn';

        return (
            <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-green-600" />
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
                <div className="border-t border-green-300 pt-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <span className="text-gray-600">Đơn giá: </span>
                                <span className="font-semibold text-green-700">{formatPrice(unitPrice)}</span>
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
                            <div className="text-lg font-bold text-green-600">
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

                {/* User info */}
                {currentUser && (
                    <Card className="mb-6">
                        <CardContent className="py-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-500" />
                                <span className="font-medium">Bệnh nhân:</span>
                                <span>{currentUser.name}</span>
                                <span className="text-gray-500">({currentUser.email})</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Prescriptions List */}
                <div className="space-y-6">
                    {prescriptions.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn thuốc nào được duyệt</h3>
                                <p className="text-gray-500 mb-4">
                                    Bạn chưa có đơn thuốc nào được duyệt từ bác sĩ.
                                    Vui lòng liên hệ bác sĩ để được kê đơn thuốc.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        prescriptions.map((prescription) => {
                            const totalValue = calculatePrescriptionTotal(prescription.items);

                            return (
                                <Card key={prescription.id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-green-600" />
                                                Đơn thuốc #{prescription.id}
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(prescription.status)}
                                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                    {formatPrice(totalValue)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Bác sĩ: {prescription.doctor_name || prescription.doctorName || 'Không có thông tin'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(prescription.created_at || prescription.createdAt).toLocaleDateString('vi-VN')}
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
                                            <div className="bg-green-100 p-4 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-semibold text-green-900">Tóm tắt đơn thuốc</h4>
                                                        <p className="text-sm text-green-800">
                                                            Tổng cộng {prescription.items.length} loại thuốc
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-green-700">
                                                            {formatPrice(totalValue)}
                                                        </div>
                                                        <div className="text-sm text-green-600">
                                                            Tổng giá trị đơn thuốc
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {prescription.items && prescription.items.length > 0 && (
                                            <div className="flex gap-3 pt-4 border-t">
                                                <Button
                                                    onClick={() => handleOrderPrescription(prescription)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Đặt mua thuốc - {formatPrice(totalValue)}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyPrescriptions;