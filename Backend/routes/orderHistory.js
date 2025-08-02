
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

  // Fetch user’s orders
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

    // Fetch all items for those orders in one go
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

      // Group items by order_id
      const itemsByOrder = items.reduce((map, item) => {
        if (!map[item.order_id]) map[item.order_id] = [];
        map[item.order_id].push(item);
        return map;
      }, {});

      // Attach items to each order
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: itemsByOrder[order.id] || []
      }));

      // Return wrapped result
      res.json({ success: true, orders: ordersWithItems });
    });
  });
});

module.exports = router;
