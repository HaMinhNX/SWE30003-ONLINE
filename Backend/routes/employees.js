const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees
router.get('/', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new employee
router.post('/', (req, res) => {
  const { name, role, store, email } = req.body;
  if (!name || !role || !store || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.query('INSERT INTO employees (name, role, store, email) VALUES (?, ?, ?, ?)', 
    [name, role, store, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, role, store, email });
  });
});


// PUT: cập nhật nhân viên
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, role, store, email } = req.body;

  const query = `
    UPDATE employees SET 
    name = ?, role = ?, store = ?, email = ?
    WHERE id = ?`;

  db.query(query, [name, role, store, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE: xoá nhân viên
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});
