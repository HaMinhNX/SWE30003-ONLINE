const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all stores
router.get('/', (req, res) => {
  db.query('SELECT * FROM stores', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new store
router.post('/', (req, res) => {
  const { name, manager, address } = req.body;
  if (!name || !manager || !address) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.query('INSERT INTO stores (name, manager, address, revenue) VALUES (?, ?, ?, 0)', 
    [name, manager, address],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, manager, address, revenue: 0 });
  });
});


// PUT: cập nhật cửa hàng
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, manager, address, revenue } = req.body;

  const query = `
    UPDATE stores SET 
    name = ?, manager = ?, address = ?, revenue = ?
    WHERE id = ?`;

  db.query(query, [name, manager, address, revenue, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE: xoá cửa hàng
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM stores WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// at the very end of routes/stores.js
module.exports = router;
