import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, User, FileText, Send } from 'lucide-react';

const PrescriptionPopup = ({
  isVisible,
  onClose,
  prescriptionItems,
  onSendPrescription
}) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchPatient, setSearchPatient] = useState('');

  // Mock patient data - in real app, this would come from Firebase/API
  const patients = [
    { id: 1, name: 'Nguyễn Văn A', email: 'customer.longchau.com', age: 35 },
    { id: 2, name: 'Trần Thị B', email: 'customer2@longchau.com', age: 28 },
    { id: 3, name: 'Lê Văn C', email: 'customer3@longchau.com', age: 45 }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const handleSendPrescription = () => {
    if (!selectedPatient || prescriptionItems.length === 0) {
      alert('Vui lòng chọn bệnh nhân và có ít nhất một loại thuốc trong đơn!');
      return;
    }

    // Save prescription data to localStorage - in real app, this would go to Firebase
    const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const selectedPatientData = patients.find(p => p.id.toString() === selectedPatient);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newPrescription = {
      id: Date.now(),
      patientId: selectedPatient,
      patient: selectedPatientData,
      doctorName: currentUser.name,
      items: prescriptionItems,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    existingPrescriptions.push(newPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(existingPrescriptions));

    alert(`Đã gửi đơn thuốc cho ${selectedPatientData?.name} thành công!`);
    onSendPrescription();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Kê đơn thuốc
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient Selection */}
          <div>
            <Label className="text-sm font-medium">Chọn bệnh nhân</Label>
            <Input
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedPatient === patient.id.toString()
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient.id.toString())}
                >
                  <div className="text-sm font-medium">{patient.name}</div>
                  <div className="text-xs text-gray-500">{patient.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Items */}
          <div>
            <Label className="text-sm font-medium">Đơn thuốc ({prescriptionItems.length} thuốc)</Label>
            <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
              {prescriptionItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chưa có thuốc nào trong đơn
                </p>
              ) : (
                prescriptionItems.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-600">Số lượng: {item.quantity}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSendPrescription}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!selectedPatient || prescriptionItems.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi đơn thuốc
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionPopup;
