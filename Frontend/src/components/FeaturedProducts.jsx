import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Sản phẩm <span className="text-primary">bán chạy</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Các sản phẩm được tin dùng và lựa chọn nhiều nhất bởi khách hàng Long Châu
        </p>
      </div>

      {/* View All Button */}
      <div className="text-center animate-fade-in">
        <Button 
          size="lg" 
          variant="outline" 
          className="px-8 py-4 text-primary border-primary hover:bg-primary hover:text-white transition-colors"
          asChild
        >
          <Link to="/products">
            Xem tất cả sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
