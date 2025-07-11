import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const CartHover = ({ items, isVisible }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!isVisible || items.length === 0) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">Giỏ hàng của bạn</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPrice(item.price)} x {item.quantity}
                  </div>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  {item.quantity}
                </Badge>
              </div>
            ))}
            
            {items.length > 5 && (
              <div className="text-sm text-gray-500 text-center py-2">
                ... và {items.length - 5} sản phẩm khác
              </div>
            )}
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Tổng cộng:</span>
              <span className="font-bold text-primary">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartHover;
