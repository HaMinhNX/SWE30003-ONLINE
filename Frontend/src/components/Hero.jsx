import React from 'react';
import { Button } from './ui/button';
import { ShoppingCart, MapPin, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    
    <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/10">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Hệ thống nhà thuốc uy tín #1 Việt Nam
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-primary">Long Châu</span>
              <br />
              Chăm sóc sức khỏe toàn diện
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Hệ thống quản lý nhà thuốc hiện đại với hơn 1000+ sản phẩm chính hãng, 
              đội ngũ dược sĩ chuyên nghiệp và dịch vụ tư vấn 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg flex items-center" asChild>
                <Link to="/products">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Mua sắm ngay
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg flex items-center border-primary text-primary hover:bg-primary/5" asChild>
                <a href="#store-locator">
                  <MapPin className="w-5 h-5 mr-2" />
                  Tìm cửa hàng gần bạn
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Cửa hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-gray-600">Khách hàng</div>
              </div>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative animate-slide-up">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary/20 rounded-full"></div>
              
              {/* Main content area - prescription interface image */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
                  <img 
                    src="/uploads/769b4aa9-cf15-4649-9c61-8c84be84837c.png" 
                    alt="Giao diện đơn thuốc điện tử Long Châu"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Paracetamol 500mg</span>
                    <span className="text-sm font-medium text-primary">2 viên/ngày</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Vitamin C 1000mg</span>
                    <span className="text-sm font-medium text-primary">1 viên/ngày</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Omega-3</span>
                    <span className="text-sm font-medium text-primary">1 viên/ngày</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90" asChild>
                  <Link to="/prescriptions">
                    Xem chi tiết đơn thuốc
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sản phẩm chính hãng</h3>
            <p className="text-gray-600">100% sản phẩm chính hãng từ các nhà sản xuất uy tín, đảm bảo chất lượng và an toàn.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Giao hàng nhanh chóng</h3>
            <p className="text-gray-600">Giao hàng trong vòng 2-4 giờ tại nội thành, đảm bảo thuốc đến tay bạn kịp thời.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mạng lưới rộng khắp</h3>
            <p className="text-gray-600">Hơn 500 cửa hàng trên toàn quốc, luôn có Long Châu gần bạn nhất.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
