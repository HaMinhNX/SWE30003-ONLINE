import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, User, Calendar, FileText, Send, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Prescription = () => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [prescriptionItems, setPrescriptionItems] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [dosage, setDosage] = useState('');
    const [quantity, setQuantity] = useState('');
    const [instructions, setInstructions] = useState('');
    const [previousPrescriptions, setPreviousPrescriptions] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            const selected = patients.find(p => p.id.toString() === selectedPatient);
            if (!selected) return;

            setLoadingHistory(true);
            try {
                const res = await fetch(`http://localhost:5000/api/prescriptions?email=${selected.email}`);
                const data = await res.json();
                setPreviousPrescriptions(data);
            } catch (err) {
                console.error("Lỗi khi tải đơn thuốc trước đó:", err);
            } finally {
                setLoadingHistory(false);
            }
        };

        if (selectedPatient) {
            fetchPrescriptions();
        }
    }, [selectedPatient, patients]);

    useEffect(() => {
        const removeDiacritics = (str) => {
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');
        };

        const fetchPatients = async () => {
            const res = await fetch('http://localhost:5000/api/auth/users');
            const data = await res.json();

            const filtered = data.filter(user => user.role === 'Customer')
                .map((user) => ({
                    ...user,
                    _normalizedName: removeDiacritics(user.name.toLowerCase()),
                    _normalizedEmail: removeDiacritics(user.email.toLowerCase())
                }));

            console.log('Filtered patients:', filtered);
            setPatients(filtered);
        };

        const fetchMedicines = async () => {
            const res = await fetch('http://localhost:5000/api/products');
            const data = await res.json();
            setMedicines(data);
        };

        fetchPatients();
        fetchMedicines();
    }, []);

    const normalizedSearch = searchPatient.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();

    const filteredPatients = patients.filter(patient =>
        patient._normalizedName.includes(normalizedSearch) ||
        patient._normalizedEmail.includes(normalizedSearch)
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
    };

    const addMedicine = () => {
        if (selectedMedicine && dosage && quantity && instructions) {
            const medicine = medicines.find(m => m.id.toString() === selectedMedicine);
            const newItem = {
                id: Date.now(),
                medicine: {
                    id: medicine.id,
                    name: medicine.name,
                    type: medicine.category || medicine.type,
                    brand: medicine.brand,
                    description: medicine.description,
                    price: medicine.price,
                    original_price: medicine.original_price,
                    stock: medicine.stock
                },
                dosage,
                quantity: parseInt(quantity),
                instructions,
                totalPrice: medicine.price * parseInt(quantity)
            };
            setPrescriptionItems([...prescriptionItems, newItem]);
            setSelectedMedicine('');
            setDosage('');
            setQuantity('');
            setInstructions('');
        }
    };

    const removeMedicine = (id) => {
        setPrescriptionItems(prescriptionItems.filter(item => item.id !== id));
    };

    const getTotalPrescriptionValue = () => {
        return prescriptionItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const sendPrescription = async () => {
        if (!selectedPatient || prescriptionItems.length === 0) {
            alert('Vui lòng chọn bệnh nhân và thêm thuốc!');
            return;
        }

        // Check if there's already a prescription for this patient today
        const hasToday = previousPrescriptions.some(p => {
            const today = new Date().toDateString();
            return new Date(p.created_at || p.createdAt).toDateString() === today;
        });

        if (hasToday) {
            alert('Bệnh nhân này đã được kê đơn hôm nay.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/prescriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientEmail: patients.find(p => p.id.toString() === selectedPatient).email,
                    doctorName: JSON.parse(localStorage.getItem('user') || '{}').name,
                    items: prescriptionItems
                })
            });

            if (!response.ok) {
                console.error('Server returned HTTP', response.status);
                alert(`Lỗi máy chủ: ${response.status}`);
                return;
            }

            const data = await response.json();
            console.log('POST /api/prescriptions →', data);

            if (data.success) {
                alert('✅ Đơn thuốc đã gửi thành công!');
                setPrescriptionItems([]);
                setSelectedPatient('');
                // Refresh previous prescriptions
                const updated = await fetch(`http://localhost:5000/api/prescriptions?email=${patients.find(p => p.id.toString() === selectedPatient).email}`);
                const updatedData = await updated.json();
                setPreviousPrescriptions(updatedData);
            } else {
                alert('❌ Gửi thất bại: ' + (data.error || 'Không rõ lỗi'));
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('❌ Không thể kết nối tới máy chủ. Vui lòng thử lại.');
        }
    };

    const getSelectedMedicineDetails = () => {
        if (!selectedMedicine) return null;
        return medicines.find(m => m.id.toString() === selectedMedicine);
    };

    const selectedMedicineInfo = getSelectedMedicineDetails();

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
                        <h1 className="text-3xl font-bold text-gray-900">Kê đơn thuốc</h1>
                        <p className="text-gray-600">Tạo đơn thuốc cho bệnh nhân</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chọn bệnh nhân */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Chọn bệnh nhân
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Tìm kiếm bệnh nhân..."
                                        value={searchPatient}
                                        onChange={(e) => setSearchPatient(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {filteredPatients.map((patient) => {
                                        const isSelected = selectedPatient === patient.id.toString();
                                        return (
                                            <div
                                                key={patient.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors 
                          ${isSelected
                                                        ? 'bg-green-100 border-green-500 ring-1 ring-green-300'
                                                        : 'hover:bg-gray-100'
                                                    }`}
                                                onClick={() => setSelectedPatient(patient.id.toString())}
                                            >
                                                <div className="font-medium text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-600 italic">{patient.email}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Previous Prescriptions */}
                        {previousPrescriptions.length > 0 && (
                            <div className="mt-6 bg-white border p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-2">Đơn thuốc trước đó:</h2>
                                {loadingHistory ? (
                                    <p className="text-gray-500">Đang tải...</p>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {previousPrescriptions.map((presc) => (
                                            <div key={presc.id} className="border-b pb-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-medium">#{presc.id}</p>
                                                    <Badge
                                                        className={
                                                            presc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                presc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                        }
                                                    >
                                                        {presc.status === 'approved' ? 'Đã duyệt' :
                                                            presc.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Ngày:</strong> {new Date(presc.created_at || presc.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                                <div className="mt-1">
                                                    <p className="text-sm font-medium">Thuốc:</p>
                                                    <ul className="list-disc ml-5 text-sm text-gray-600">
                                                        {presc.items.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item.medicine?.name || item.medicine_name} ({item.dosage}) x{item.quantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Kê đơn thuốc */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thêm thuốc */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Thêm thuốc
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="medicine">Chọn thuốc</Label>
                                        <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn thuốc" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {medicines.map((medicine) => (
                                                    <SelectItem key={medicine.id} value={medicine.id.toString()}>
                                                        <div className="w-full">
                                                            <div className="font-medium">{medicine.name}</div>
                                                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                                                <span>{medicine.category || medicine.type}</span>
                                                                <span className="font-medium text-green-600">
                                                                    {formatPrice(medicine.price)}
                                                                </span>
                                                            </div>
                                                            {medicine.brand && (
                                                                <div className="text-xs text-gray-400">Thương hiệu: {medicine.brand}</div>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Medicine Details Preview */}
                                    {selectedMedicineInfo && (
                                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-blue-900">Thông tin thuốc đã chọn</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p><strong>Tên:</strong> {selectedMedicineInfo.name}</p>
                                                    <p><strong>Loại:</strong> {selectedMedicineInfo.category || selectedMedicineInfo.type}</p>
                                                    {selectedMedicineInfo.brand && (
                                                        <p><strong>Thương hiệu:</strong> {selectedMedicineInfo.brand}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p><strong>Giá:</strong> <span className="text-green-600 font-medium">{formatPrice(selectedMedicineInfo.price)}</span></p>
                                                    <p><strong>Tồn kho:</strong> {selectedMedicineInfo.stock} sản phẩm</p>
                                                    {selectedMedicineInfo.original_price && selectedMedicineInfo.original_price > selectedMedicineInfo.price && (
                                                        <p className="text-red-500"><strong>Giá gốc:</strong> <span className="line-through">{formatPrice(selectedMedicineInfo.original_price)}</span></p>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedMedicineInfo.description && (
                                                <p className="mt-2 text-sm text-gray-700"><strong>Mô tả:</strong> {selectedMedicineInfo.description}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="dosage">Liều dùng</Label>
                                        <Input
                                            id="dosage"
                                            placeholder="VD: 1 viên/lần, 2 lần/ngày"
                                            value={dosage}
                                            onChange={(e) => setDosage(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="quantity">Số lượng</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="Số lượng"
                                            min="1"
                                            max={selectedMedicineInfo?.stock || 999}
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                        {selectedMedicineInfo && quantity && (
                                            <p className="text-sm text-green-600 mt-1">
                                                Tổng giá: {formatPrice(selectedMedicineInfo.price * parseInt(quantity || 0))}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="instructions">Cách dùng</Label>
                                        <Textarea
                                            id="instructions"
                                            placeholder="VD: Uống sau khi ăn, cách 8 tiếng/lần"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <Button onClick={addMedicine} className="w-full" disabled={!selectedMedicine || !dosage || !quantity || !instructions}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm thuốc vào đơn
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Danh sách thuốc đã thêm */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Đơn thuốc ({prescriptionItems.length} thuốc)
                                    </div>
                                    {prescriptionItems.length > 0 && (
                                        <div className="text-lg font-bold text-green-600">
                                            Tổng giá trị: {formatPrice(getTotalPrescriptionValue())}
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {prescriptionItems.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Chưa có thuốc nào trong đơn
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {prescriptionItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="font-medium text-lg">{item.medicine.name}</div>
                                                        <div className="font-bold text-green-600">{formatPrice(item.totalPrice)}</div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                        <div>
                                                            <p><strong>Loại:</strong> {item.medicine.type}</p>
                                                            {item.medicine.brand && (
                                                                <p><strong>Thương hiệu:</strong> {item.medicine.brand}</p>
                                                            )}
                                                            <p><strong>Đơn giá:</strong> {formatPrice(item.medicine.price)}</p>
                                                        </div>
                                                        <div>
                                                            <p><strong>Liều dùng:</strong> {item.dosage}</p>
                                                            <p><strong>Số lượng:</strong> {item.quantity}</p>
                                                            <p><strong>Tổng giá:</strong> <span className="font-medium text-green-600">{formatPrice(item.totalPrice)}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm">
                                                        <p><strong>Cách dùng:</strong> {item.instructions}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMedicine(item.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Gửi đơn thuốc */}
                        {prescriptionItems.length > 0 && selectedPatient && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                                        <h3 className="font-medium text-green-900 mb-2">Tóm tắt đơn thuốc</h3>
                                        <div className="text-sm text-green-800">
                                            <p><strong>Bệnh nhân:</strong> {patients.find(p => p.id.toString() === selectedPatient)?.name}</p>
                                            <p><strong>Số loại thuốc:</strong> {prescriptionItems.length}</p>
                                            <p><strong>Tổng giá trị ước tính:</strong> <span className="font-bold">{formatPrice(getTotalPrescriptionValue())}</span></p>
                                        </div>
                                    </div>
                                    <Button onClick={sendPrescription} className="w-full bg-primary hover:bg-primary/90">
                                        <Send className="w-4 h-4 mr-2" />
                                        Gửi đơn thuốc cho bệnh nhân
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Prescription;