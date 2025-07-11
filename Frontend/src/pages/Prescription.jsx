import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, User, Calendar, FileText, Send, ArrowLeft } from 'lucide-react';
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

  // Mock data cho bệnh nhân
  const patients = [
    { id: 1, name: 'Nguyễn Văn A', email: 'customer@longchau.com', phone: '0123456789', age: 35 },
    { id: 2, name: 'Trần Thị B', email: 'customer2@longchau.com', phone: '0987654321', age: 28 },
    { id: 3, name: 'Lê Văn C', email: 'customer3@longchau.com', phone: '0369258147', age: 45 }
  ];

  // Mock data cho thuốc
  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', type: 'Thuốc giảm đau' },
    { id: 2, name: 'Amoxicillin 250mg', type: 'Kháng sinh' },
    { id: 3, name: 'Vitamin C 1000mg', type: 'Thực phẩm chức năng' },
    { id: 4, name: 'Omeprazole 20mg', type: 'Thuốc dạ dày' },
    { id: 5, name: 'Cetirizine 10mg', type: 'Thuốc dị ứng' }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const addMedicine = () => {
    if (selectedMedicine && dosage && quantity && instructions) {
      const medicine = medicines.find(m => m.id.toString() === selectedMedicine);
      const newItem = {
        id: Date.now(),
        medicine: medicine,
        dosage,
        quantity: parseInt(quantity),
        instructions
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

  const sendPrescription = () => {
    if (!selectedPatient || prescriptionItems.length === 0) {
      alert('Vui lòng chọn bệnh nhân và thêm ít nhất một loại thuốc!');
      return;
    }

    // Lưu đơn thuốc vào localStorage
    const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const newPrescription = {
      id: Date.now(),
      patientId: selectedPatient,
      patient: patients.find(p => p.id.toString() === selectedPatient),
      doctorName: JSON.parse(localStorage.getItem('user') || '{}').name,
      items: prescriptionItems,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    existingPrescriptions.push(newPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(existingPrescriptions));

    alert('Đã gửi đơn thuốc thành công!');
    setSelectedPatient('');
    setPrescriptionItems([]);
  };

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
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient === patient.id.toString()
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPatient(patient.id.toString())}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                      <div className="text-sm text-gray-500">Tuổi: {patient.age}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  <div>
                    <Label htmlFor="medicine">Chọn thuốc</Label>
                    <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thuốc" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicines.map((medicine) => (
                          <SelectItem key={medicine.id} value={medicine.id.toString()}>
                            <div>
                              <div className="font-medium">{medicine.name}</div>
                              <div className="text-sm text-gray-500">{medicine.type}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dosage">Liều dùng</Label>
                    <Input
                      id="dosage"
                      placeholder="VD: 1 viên/lần"
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Cách dùng</Label>
                    <Input
                      id="instructions"
                      placeholder="VD: Uống sau khi ăn"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={addMedicine} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thuốc vào đơn
                </Button>
              </CardContent>
            </Card>

            {/* Danh sách thuốc đã thêm */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Đơn thuốc ({prescriptionItems.length} thuốc)
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
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.medicine.name}</div>
                          <div className="text-sm text-gray-500">{item.medicine.type}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Liều dùng:</span> {item.dosage} | 
                            <span className="font-medium"> Số lượng:</span> {item.quantity} | 
                            <span className="font-medium"> Cách dùng:</span> {item.instructions}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedicine(item.id)}
                          className="text-red-600 hover:text-red-700"
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
