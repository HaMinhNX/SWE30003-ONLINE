import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-xl">
                LC
              </div>
              <span className="text-xl font-bold">Long Châu</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Hệ thống nhà thuốc uy tín hàng đầu Việt Nam với hơn 20 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe.
            </p>
            
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <Youtube className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Sản phẩm</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Dịch vụ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Tin tức</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Tư vấn dược sĩ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Đơn thuốc điện tử</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Giao hàng tận nơi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Chăm sóc 24/7</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Bảo hiểm y tế</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Tầng 12, Tòa nhà AB Tower<br />
                  76 Lê Lai, Q.1, TP.HCM
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">1800 6928</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@longchau.com</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Thứ 2 - Thứ 6: 7:00 - 22:00</div>
                  <div>Thứ 7 - CN: 8:00 - 21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Long Châu Pharmacy. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Chính sách đổi trả
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
