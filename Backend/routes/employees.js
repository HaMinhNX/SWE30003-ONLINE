const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees with store information
router.get('/', (req, res) => {
  const query = `
    SELECT e.*, s.name as store_name 
    FROM employees e 
    LEFT JOIN stores s ON e.store_id = s.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Transform to match frontend expectations
    const transformedResults = results.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      store: emp.store_name || '', // Frontend expects 'store', database has 'store_name'
      store_id: emp.store_id
    }));

    res.json(transformedResults);
  });
});

// POST new employee
router.post('/', (req, res) => {
  const { name, role, store, email } = req.body;

  if (!name || !role || !store || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // First, find the store_id from store name
  db.query('SELECT id FROM stores WHERE name = ?', [store], (err, storeResults) => {
    if (err) return res.status(500).json({ error: err.message });

    let store_id = null;
    if (storeResults.length > 0) {
      store_id = storeResults[0].id;
    }

    // Insert employee with store_id
    db.query(
      'INSERT INTO employees (name, role, store_id, email) VALUES (?, ?, ?, ?)',
      [name, role, store_id, email],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Return employee data in format expected by frontend
        res.json({
          id: result.insertId,
          name,
          role,
          store, // Return store name, not store_id
          email
        });
      }
    );
  });
});

// PUT: update employee
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, role, store, email } = req.body;

  // First, find the store_id from store name
  db.query('SELECT id FROM stores WHERE name = ?', [store], (err, storeResults) => {
    if (err) return res.status(500).json({ error: err.message });

    let store_id = null;
    if (storeResults.length > 0) {
      store_id = storeResults[0].id;
    }

    const query = `
      UPDATE employees SET 
      name = ?, role = ?, store_id = ?, email = ?
      WHERE id = ?`;

    db.query(query, [name, role, store_id, email, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// DELETE: delete employee
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;