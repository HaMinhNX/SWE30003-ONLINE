import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const StoreLocator = () => {
  const stores = [
    {
      id: 1,
      name: 'Long Châu Nguyễn Trãi',
      address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
      phone: '(028) 3925 1234',
      hours: '7:00 - 22:00',
      distance: '0.5 km',
      isOpen: true
    },
    {
      id: 2,
      name: 'Long Châu Lê Văn Sỹ',
      address: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
      phone: '(028) 3925 5678',
      hours: '6:30 - 23:00',
      distance: '1.2 km',
      isOpen: true
    },
    {
      id: 3,
      name: 'Long Châu Cách Mạng Tháng 8',
      address: '789 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      phone: '(028) 3925 9012',
      hours: '7:30 - 21:30',
      distance: '2.1 km',
      isOpen: false
    }
  ];

  return (
    <div id="store-locator" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Cửa hàng <span className="text-primary">gần bạn</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tìm và đến cửa hàng Long Châu gần nhất để nhận thuốc nhanh chóng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map Area */}
          <div className="animate-slide-up">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
              {/* Decorative map elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-primary rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-primary rounded-full animate-pulse delay-500"></div>
              </div>
              
              <div className="text-center z-10">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bản đồ cửa hàng</h3>
                <p className="text-gray-600 mb-6">Xem vị trí các cửa hàng Long Châu gần bạn</p>
  
              </div>
            </div>
          </div>

          {/* Store List */}
          <div className="space-y-6">
            {stores.map((store, index) => (
              <Card key={store.id} className="hover-lift transition-all duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">{store.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          store.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}
                        </span>
                        <span className="text-sm text-gray-500">{store.distance}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{store.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{store.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Mở cửa: {store.hours}</span>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
