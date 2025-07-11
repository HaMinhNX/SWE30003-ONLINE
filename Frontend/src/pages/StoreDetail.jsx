import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  TrendingUp,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StoreDetail = () => {
  const { id } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for store details
  const store = {
    id: parseInt(id || '1'),
    name: 'Long Châu Quận 1',
    manager: 'Nguyễn Văn D',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    revenue: 50000000
  };

  // Mock revenue data by period
  const revenueData = {
    week: {
      total: 12000000,
      growth: '+15%',
      orders: 45,
      topProducts: [
        { name: 'Paracetamol 500mg', sold: 120, revenue: 3000000 },
        { name: 'Vitamin C 1000mg', sold: 80, revenue: 12000000 },
        { name: 'Gel rửa tay khô', sold: 200, revenue: 7000000 }
      ]
    },
    month: {
      total: 50000000,
      growth: '+22%',
      orders: 180,
      topProducts: [
        { name: 'Paracetamol 500mg', sold: 500, revenue: 12500000 },
        { name: 'Vitamin C 1000mg', sold: 300, revenue: 45000000 },
        { name: 'Gel rửa tay khô', sold: 800, revenue: 28000000 }
      ]
    },
    year: {
      total: 600000000,
      growth: '+18%',
      orders: 2200,
      topProducts: [
        { name: 'Paracetamol 500mg', sold: 6000, revenue: 150000000 },
        { name: 'Vitamin C 1000mg', sold: 3500, revenue: 525000000 },
        { name: 'Gel rửa tay khô', sold: 9600, revenue: 336000000 }
      ]
    }
  };

  // Mock inventory data
  const inventory = [
    { id: 1, name: 'Paracetamol 500mg', stock: 150, minStock: 50, status: 'good' },
    { id: 2, name: 'Vitamin C 1000mg', stock: 30, minStock: 25, status: 'low' },
    { id: 3, name: 'Gel rửa tay khô', stock: 5, minStock: 20, status: 'critical' },
    { id: 4, name: 'Thuốc ho Bro-P', stock: 80, minStock: 30, status: 'good' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const currentData = revenueData[selectedPeriod];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/management">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại quản lý
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600">Chi tiết cửa hàng và báo cáo</p>
          </div>
        </div>

        {/* Store Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900">Quản lý cửa hàng</h3>
                <p className="text-gray-600">{store.manager}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Địa chỉ</h3>
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Tổng doanh thu</h3>
                <p className="text-2xl font-bold text-primary">{formatPrice(store.revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Báo cáo doanh thu</TabsTrigger>
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          </TabsList>

          {/* Revenue Report */}
          <TabsContent value="revenue">
            <div className="space-y-6">
              {/* Period Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Chọn khoảng thời gian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {[
                      { key: 'week', label: 'Tuần này' },
                      { key: 'month', label: 'Tháng này' },
                      { key: 'year', label: 'Năm này' }
                    ].map((period) => (
                      <Button
                        key={period.key}
                        variant={selectedPeriod === period.key ? "default" : "outline"}
                        onClick={() => setSelectedPeriod(period.key)}
                      >
                        {period.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(currentData.total)}</p>
                        <p className="text-sm text-green-600">{currentData.growth}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                        <p className="text-2xl font-bold text-gray-900">{currentData.orders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Trung bình/đơn</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(Math.round(currentData.total / currentData.orders))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">Đã bán: {product.sold} sản phẩm</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatPrice(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Tồn kho sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Tồn kho tối thiểu: {item.minStock}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{item.stock} sản phẩm</p>
                        </div>
                        <Badge 
                          variant={
                            item.status === 'critical' ? 'destructive' :
                            item.status === 'low' ? 'secondary' : 'default'
                          }
                        >
                          {item.status === 'critical' ? 'Cần nhập hàng' :
                           item.status === 'low' ? 'Sắp hết' : 'Đủ hàng'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default StoreDetail;
