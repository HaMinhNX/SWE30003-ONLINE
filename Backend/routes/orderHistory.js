// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // Đảm bảo bạn đã cấu hình kết nối MySQL đúng

// // Lấy đơn hàng của người dùng theo email
// router.get('/history', (req, res) => {
//   const { email } = req.query;  // Lấy email từ query params
  
//   if (!email) {
//     return res.status(400).json({ error: 'Missing email' });
//   }

//   // Truy vấn đơn hàng của người dùng theo email
//   const query = `
//     SELECT * FROM orders 
//     WHERE user_email = ? 
//     ORDER BY created_at DESC`;  // Sắp xếp theo thời gian tạo đơn hàng

//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error('Error fetching orders:', err);
//       return res.status(500).json({ error: 'Server error' });
//     }

//     // Trả về danh sách đơn hàng
//     res.json({ success: true, orders: results });
//   });
// });

// // Lấy các sản phẩm trong đơn hàng theo order_id
// router.get('/items', (req, res) => {
//   const { orderId } = req.query;
//   if (!orderId) {
//     return res.status(400).json({ error: 'Missing order ID' });
//   }

//   const query = `
//     SELECT * FROM order_items 
//     WHERE order_id = ?`;

//   db.query(query, [orderId], (err, results) => {
//     if (err) {
//       console.error('Error fetching order items:', err);
//       return res.status(500).json({ error: 'Server error' });
//     }

//     res.json({ success: true, items: results });
//   });
// });

// module.exports = router;



// routes/orderHistory.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/orderHistory/history?email=…
router.get('/history', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Missing email' });
  }

  // 1) Fetch user’s orders
  const ordersSql = `
    SELECT * 
      FROM orders 
     WHERE user_email = ? 
     ORDER BY created_at DESC
  `;
  db.query(ordersSql, [email], (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) {
      // no orders → respond immediately
      return res.json({ success: true, orders: [] });
    }

    // 2) Fetch all items for those orders in one go
    const itemsSql = `
      SELECT * 
        FROM order_items 
       WHERE order_id IN (?)
    `;
    db.query(itemsSql, [orderIds], (err2, items) => {
      if (err2) {
        console.error('Error fetching order items:', err2);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      // 3) Group items by order_id
      const itemsByOrder = items.reduce((map, item) => {
        if (!map[item.order_id]) map[item.order_id] = [];
        map[item.order_id].push(item);
        return map;
      }, {});

      // 4) Attach items to each order
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: itemsByOrder[order.id] || []
      }));

      // 5) Return wrapped result
      res.json({ success: true, orders: ordersWithItems });
    });
  });
});

module.exports = router;
