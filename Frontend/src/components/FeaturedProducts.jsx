import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Thuốc giảm đau',
      price: 25000,
      originalPrice: 30000,
      rating: 4.8,
      reviews: 156,
      image: '/placeholder.svg',
      isHot: true,
      discount: 17
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'Thực phẩm chức năng',
      price: 150000,
      originalPrice: 180000,
      rating: 4.9,
      reviews: 203,
      image: '/placeholder.svg',
      isNew: true,
      discount: 17
    },
    {
      id: 3,
      name: 'Omega-3 Fish Oil',
      category: 'Thực phẩm chức năng',
      price: 320000,
      originalPrice: 380000,
      rating: 4.7,
      reviews: 89,
      image: '/placeholder.svg',
      discount: 16
    },
    {
      id: 4,
      name: 'Thuốc ho Bảo Thanh',
      category: 'Thuốc ho',
      price: 45000,
      originalPrice: 50000,
      rating: 4.6,
      reviews: 124,
      image: '/placeholder.svg',
      discount: 10
    },
    {
      id: 5,
      name: 'Gel rửa tay khô',
      category: 'Sản phẩm y tế',
      price: 35000,
      originalPrice: 40000,
      rating: 4.5,
      reviews: 78,
      image: '/placeholder.svg',
      isHot: true,
      discount: 13
    },
    {
      id: 6,
      name: 'Máy đo huyết áp Omron',
      category: 'Thiết bị y tế',
      price: 1200000,
      originalPrice: 1400000,
      rating: 4.8,
      reviews: 45,
      image: '/placeholder.svg',
      discount: 14
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const addToCart = (product) => {
    console.log(`Thêm ${product.name} vào giỏ hàng`);
    // Logic thêm vào giỏ hàng sẽ được implement sau
  };

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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product, index) => (
          <Card key={product.id} className="hover-lift cursor-pointer group border-0 shadow-lg hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="relative p-0">
              <Link to={`/product/${product.id}`}>
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg bg-gray-100 h-48 flex items-center justify-center">
                  <div className="text-6xl text-gray-300">📦</div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isHot && (
                      <Badge className="bg-red-500 text-white">HOT</Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-blue-500 text-white">MỚI</Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-primary text-white">-{product.discount}%</Badge>
                    )}
                  </div>
                </div>
              </Link>

              {/* Wishlist Button */}
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Thêm vào yêu thích:', product.name);
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-4">
              {/* Category */}
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              
              {/* Product Name */}
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviews} đánh giá)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="w-4 h-4" />
                Thêm vào giỏ
              </Button>
            </CardFooter>
          </Card>
        ))}
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
