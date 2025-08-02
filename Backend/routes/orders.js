// // routes/orders.js
// const express = require('express');
// const router = express.Router();
// const db = require('../db');



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

//     db.query(sql, params, (err, orders) => {
//         if (err) {
//             console.error('Error fetching orders:', err);
//             return res.status(500).json({ success: false, message: 'Server error' });
//         }

//         const orderIds = orders.map(o => o.id);
//         if (orderIds.length === 0) {
//             // No orders → return empty list
//             return res.json({ success: true, orders: [] });
//         }

//         // Fetch all items for these orders
//         const itemsSql = `
//       SELECT * FROM order_items
//       WHERE order_id IN (?)
//     `;
//         db.query(itemsSql, [orderIds], (err2, items) => {
//             if (err2) {
//                 console.error('Error fetching order items:', err2);
//                 return res.status(500).json({ success: false, message: 'Server error' });
//             }

//             // Group by order_id
//             const itemsByOrder = items.reduce((map, item) => {
//                 (map[item.order_id] = map[item.order_id] || []).push(item);
//                 return map;
//             }, {});

//             // Attach items to orders
//             const ordersWithItems = orders.map(order => ({
//                 ...order,
//                 items: itemsByOrder[order.id] || []
//             }));

//             res.json({ success: true, orders: ordersWithItems });
//         });
//     });
// });


// // Create a new order
// router.post('/', (req, res) => {
//     const { user_email, customerInfo, items, totalAmount, paymentMethod } = req.body;

//     if (!user_email || !customerInfo || !items || !items.length) {
//         return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
//     }

//     const insertOrder = `
//     INSERT INTO orders (
//       user_email, customer_name, phone, address, district, city, note,
//       total_amount, payment_method, status, created_at
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
//   `;

//     const orderValues = [
//         user_email,
//         customerInfo.name,
//         customerInfo.phone,
//         customerInfo.address,
//         customerInfo.district,
//         customerInfo.city,
//         customerInfo.note,
//         totalAmount,
//         paymentMethod
//     ];

//     db.query(insertOrder, orderValues, (err, result) => {
//         if (err) {
//             console.error('Lỗi tạo đơn hàng:', err);
//             return res.status(500).json({ error: 'Lỗi máy chủ khi tạo đơn hàng' });
//         }

//         const orderId = result.insertId;

//         const itemValues = items.map(item => [
//             orderId,
//             item.id,
//             item.name,
//             item.quantity,
//             item.price,
//             item.category || ''
//         ]);

//         const insertItems = `
//       INSERT INTO order_items (
//         order_id, product_id, product_name, quantity, price, category
//       ) VALUES ?
//     `;

//         db.query(insertItems, [itemValues], (err2) => {
//             if (err2) {
//                 console.error('Lỗi lưu mục đơn hàng:', err2);
//                 return res.status(500).json({ error: 'Lỗi khi lưu chi tiết đơn hàng' });
//             }

//             return res.json({
//                 success: true,
//                 orderId,
//                 order: {
//                     id: orderId,
//                     user_email,
//                     customerInfo,
//                     items,
//                     totalAmount,
//                     paymentMethod,
//                     status: 'pending',
//                     created_at: new Date().toISOString()
//                 }
//             });
//         });
//     });
// });

// // Update order status (cancel, confirm, etc.)
// router.patch('/:orderId/status', (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const valid = ['pending', 'confirmed', 'cancelled'];

//     if (!valid.includes(status)) {
//         return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
//     }


//     // const sql = `UPDATE orders SET status = ? WHERE id = ?`;
//     // db.query(sql, [status, orderId], (err, result) => {
//     //     if (err) {
//     //         console.error('Error updating order status:', err);
//     //         return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
//     //     }
//     //     return res.json({ success: true });
//     // });

//     db.getConnection((err, conn) => {
//         if (err) {
//             console.error('DB connection error:', err);
//             return res.status(500).json({ success: false, message: 'Lỗi kết nối DB' });
//         }

//         conn.beginTransaction(err => {
//             if (err) {
//                 conn.release();
//                 console.error('TX begin error:', err);
//                 return res.status(500).json({ success: false, message: 'Không thể bắt đầu giao dịch' });
//             }

//             // 1) Update the order status
//             conn.query(
//                 `UPDATE orders SET status = ? WHERE id = ?`,
//                 [status, orderId],
//                 (err, result) => {
//                     if (err) {
//                         return conn.rollback(() => {
//                             conn.release();
//                             console.error('Error updating order status:', err);
//                             res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn' });
//                         });
//                     }

//                     // 2) If we're confirming, decrement stock for each line item
//                     if (status === 'confirmed') {
//                         // fetch the items for this order
//                         conn.query(
//                             `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
//                             [orderId],
//                             (err, items) => {
//                                 if (err) {
//                                     return conn.rollback(() => {
//                                         conn.release();
//                                         console.error('Error fetching order items:', err);
//                                         res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết đơn' });
//                                     });
//                                 }

//                                 // Helper to update one product’s stock
//                                 const updateNext = idx => {
//                                     if (idx >= items.length) {
//                                         // Done all updates → commit
//                                         return conn.commit(err => {
//                                             if (err) {
//                                                 return conn.rollback(() => {
//                                                     conn.release();
//                                                     console.error('Commit error:', err);
//                                                     res.status(500).json({ success: false, message: 'Không thể lưu thay đổi' });
//                                                 });
//                                             }
//                                             conn.release();
//                                             return res.json({ success: true });
//                                         });
//                                     }

//                                     const { product_id, quantity } = items[idx];
//                                     conn.query(
//                                         `UPDATE products 
//                      SET stock = GREATEST(stock - ?, 0) 
//                      WHERE id = ?`,
//                                         [quantity, product_id],
//                                         err => {
//                                             if (err) {
//                                                 return conn.rollback(() => {
//                                                     conn.release();
//                                                     console.error('Error updating stock:', err);
//                                                     res.status(500).json({ success: false, message: 'Lỗi cập nhật kho' });
//                                                 });
//                                             }
//                                             // next item
//                                             updateNext(idx + 1);
//                                         }
//                                     );
//                                 };

//                                 // kick off the loop
//                                 updateNext(0);
//                             }
//                         );
//                     } else {
//                         // If not confirming, nothing else to do—just commit the status update
//                         conn.commit(err => {
//                             if (err) {
//                                 return conn.rollback(() => {
//                                     conn.release();
//                                     console.error('Commit error:', err);
//                                     res.status(500).json({ success: false, message: 'Không thể lưu thay đổi' });
//                                 });
//                             }
//                             conn.release();
//                             res.json({ success: true });
//                         });
//                     }
//                 }
//             );
//         });
//     });
// });



// module.exports = router;


// routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

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
            return res.json({ success: true, orders: [] });
        }

        // Fetch all items for these orders
        const itemsSql = `SELECT * FROM order_items WHERE order_id IN (?)`;
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

    console.log('📝 Received order data:', req.body);

    if (!user_email || !customerInfo || !items || !items.length) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: user_email, customerInfo, or items'
        });
    }

    // Validate customerInfo required fields
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        return res.status(400).json({
            success: false,
            error: 'Missing required customer info: name, phone, or address'
        });
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
        customerInfo.district || '',
        customerInfo.city || '',
        customerInfo.note || '',
        totalAmount,
        paymentMethod
    ];

    console.log('📝 Inserting order with values:', orderValues);

    db.query(insertOrder, orderValues, (err, result) => {
        if (err) {
            console.error('❌ Error creating order:', err);
            return res.status(500).json({
                success: false,
                error: 'Database error creating order: ' + err.message
            });
        }

        const orderId = result.insertId;
        console.log('✅ Order created with ID:', orderId);

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

        console.log('📝 Inserting order items:', itemValues);

        db.query(insertItems, [itemValues], (err2) => {
            if (err2) {
                console.error('❌ Error saving order items:', err2);
                return res.status(500).json({
                    success: false,
                    error: 'Database error saving order items: ' + err2.message
                });
            }

            console.log('✅ Order items saved successfully');

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

// Update order status with stock management (simplified for mysql package)
router.patch('/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    console.log(`📝 Updating order ${orderId} to status: ${status}`);

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be: pending, confirmed, or cancelled'
        });
    }

    // First, update the order status
    const updateOrderSql = `UPDATE orders SET status = ? WHERE id = ?`;

    db.query(updateOrderSql, [status, orderId], (err, result) => {
        if (err) {
            console.error('❌ Error updating order status:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to update order status: ' + err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('✅ Order status updated successfully');

        // If confirming order, update stock for each product
        if (status === 'confirmed') {
            console.log('📦 Processing stock updates for confirmed order...');

            // Fetch the items for this order
            const getItemsSql = `SELECT product_id, quantity FROM order_items WHERE order_id = ?`;

            db.query(getItemsSql, [orderId], (err, items) => {
                if (err) {
                    console.error('❌ Error fetching order items:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch order items: ' + err.message
                    });
                }

                console.log('📦 Found items to process:', items);

                if (items.length === 0) {
                    console.log('✅ Order confirmed successfully (no items)');
                    return res.json({ success: true });
                }

                // Update stock for each product sequentially
                let completedUpdates = 0;
                let hasError = false;

                const updateStock = (itemIndex) => {
                    if (hasError || itemIndex >= items.length) {
                        if (!hasError) {
                            console.log('✅ All stock updates completed successfully');
                            return res.json({ success: true });
                        }
                        return;
                    }

                    const { product_id, quantity } = items[itemIndex];
                    console.log(`📦 Updating stock for product ${product_id}: -${quantity}`);

                    const updateStockSql = `UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?`;

                    db.query(updateStockSql, [quantity, product_id], (err) => {
                        if (err) {
                            hasError = true;
                            console.error('❌ Error updating stock for product', product_id, ':', err);
                            return res.status(500).json({
                                success: false,
                                message: `Failed to update stock for product ${product_id}: ` + err.message
                            });
                        }

                        console.log(`✅ Stock updated for product ${product_id}`);
                        completedUpdates++;

                        // Continue with next item
                        updateStock(itemIndex + 1);
                    });
                };

                // Start updating stock for the first item
                updateStock(0);
            });
        } else {
            // If not confirming, just return success
            console.log(`✅ Order status updated to ${status}`);
            res.json({ success: true });
        }
    });
});

module.exports = router;
