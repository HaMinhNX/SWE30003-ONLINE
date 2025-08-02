// src/pages/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/orders?status=pending')
            .then(r => r.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
            });
    }, []);

    const updateStatus = (id, newStatus) => {
        fetch(`http://localhost:5000/api/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setOrders(prev => prev.filter(o => o.id !== id));
                } else {
                    alert('Error: ' + res.message);
                }
            });
    };

    return (
        <>
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl mb-4">Duyệt đơn hàng</h1>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-600">Không có đơn hàng chờ duyệt.</p>
                ) : orders.map(order => (
                    <Card key={order.id} className="mb-6">
                        <CardHeader>
                            <CardTitle>Đơn #{order.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Customer & Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p><strong>Khách hàng:</strong> {order.customer_name}</p>
                                    <p><strong>Địa chỉ:</strong> {order.address}{order.district && `, ${order.district}`}{order.city && `, ${order.city}`}</p>
                                </div>
                                <div>
                                    <p><strong>SĐT:</strong> {order.phone}</p>
                                    <p><strong>Email:</strong> {order.user_email || '—'}</p>
                                </div>
                            </div>

                            {/* Payment */}
                            <p className="mb-4"><strong>Phương thức thanh toán:</strong> {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ tín dụng'}</p>

                            {/* Total */}
                            <p className="mb-4"><strong>Tổng tiền:</strong> {order.total_amount.toLocaleString('vi-VN')}₫</p>

                            {/* Products */}
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Sản phẩm</h4>
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between mb-1">
                                        <span>{item.product_name} × {item.quantity}</span>
                                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-2">
                                <Button onClick={() => updateStatus(order.id, 'confirmed')}>
                                    Xác nhận
                                </Button>
                                <Button variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>
                                    Hủy đơn hàng
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Footer />
        </>
    );
}
