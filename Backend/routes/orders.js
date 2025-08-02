// routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// in routes/orders.js, add above your POST:
// router.get('/', (req, res) => {
//     const { email, status } = req.query;
//     let sql = 'SELECT * FROM orders';
//     const params = [];

//     if (email) {
//         sql += ' WHERE user_email = ?';
//         params.push(email);
//     } else if (status) {
//         sql += ' WHERE status = ?';
//         params.push(status);
//     }
//     sql += ' ORDER BY created_at DESC';

//     db.query(sql, params, (err, results) => {
//         if (err) return res.status(500).json({ success: false, message: 'Server error' });
//         res.json({ success: true, orders: results });
//     });
// });

router.get('/', (req, res) => {
    const { email, status } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (email) {
        sql += ' WHERE user_email = ?';
        params.push(email);
    } else if (status) {
        sql += ' WHERE status = ?';
        params.push(status);
    }
    sql += ' ORDER BY created_at DESC';

    db.query(sql, params, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const orderIds = orders.map(o => o.id);
        if (orderIds.length === 0) {
            // No orders → return empty list
            return res.json({ success: true, orders: [] });
        }

        // Fetch all items for these orders
        const itemsSql = `
      SELECT * FROM order_items
      WHERE order_id IN (?)
    `;
        db.query(itemsSql, [orderIds], (err2, items) => {
            if (err2) {
                console.error('Error fetching order items:', err2);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            // Group by order_id
            const itemsByOrder = items.reduce((map, item) => {
                (map[item.order_id] = map[item.order_id] || []).push(item);
                return map;
            }, {});

            // Attach items to orders
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: itemsByOrder[order.id] || []
            }));

            res.json({ success: true, orders: ordersWithItems });
        });
    });
});


// Create a new order
router.post('/', (req, res) => {
    const { user_email, customerInfo, items, totalAmount, paymentMethod } = req.body;

    if (!user_email || !customerInfo || !items || !items.length) {
        return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
    }

    const insertOrder = `
    INSERT INTO orders (
      user_email, customer_name, phone, address, district, city, note,
      total_amount, payment_method, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
  `;

    const orderValues = [
        user_email,
        customerInfo.name,
        customerInfo.phone,
        customerInfo.address,
        customerInfo.district,
        customerInfo.city,
        customerInfo.note,
        totalAmount,
        paymentMethod
    ];

    db.query(insertOrder, orderValues, (err, result) => {
        if (err) {
            console.error('Lỗi tạo đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ khi tạo đơn hàng' });
        }

        const orderId = result.insertId;

        const itemValues = items.map(item => [
            orderId,
            item.id,
            item.name,
            item.quantity,
            item.price,
            item.category || ''
        ]);

        const insertItems = `
      INSERT INTO order_items (
        order_id, product_id, product_name, quantity, price, category
      ) VALUES ?
    `;

        db.query(insertItems, [itemValues], (err2) => {
            if (err2) {
                console.error('Lỗi lưu mục đơn hàng:', err2);
                return res.status(500).json({ error: 'Lỗi khi lưu chi tiết đơn hàng' });
            }

            return res.json({
                success: true,
                orderId,
                order: {
                    id: orderId,
                    user_email,
                    customerInfo,
                    items,
                    totalAmount,
                    paymentMethod,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            });
        });
    });
});

// Update order status (cancel, confirm, etc.)
router.patch('/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
        return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
        }
        return res.json({ success: true });
    });
});


module.exports = router;
