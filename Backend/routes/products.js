// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {

  
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

router.post('/', (req, res) => {
  const {
    name, category, price, stock,
    images, brand, origin,
    description, ingredients,
    usage, storage
  } = req.body;

  console.log('Incoming product data:', req.body);

  if (!name || !price || !description || !category || !stock) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO products
      (name, category, price, stock,
       images, brand, origin,
       description, ingredients,
       \`usage\`, storage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, category, price, stock,
    images, brand, origin,
    description, ingredients,
    usage, storage
  ];


  console.log('📝 Running SQL:', query.trim());
  console.log('📝 With values:', values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ products.POST error:', err);
      return res.status(500).json({ error: err.message });
    } 
      
    // return the new row
    res.json({
      id: result.insertId,
      name, category, price, stock,
      images, brand, origin,
      description, ingredients,
      usage, storage
    });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name, category, price, stock,
    images, brand, origin,
    description, ingredients,
    usage, storage
  } = req.body;

  const query = `
    UPDATE products SET
      name=?, category=?, price=?, stock=?,
      images=?, brand=?, origin=?,
      description=?, ingredients=?,
      \`usage\`=?, storage=?
    WHERE id = ?
  `;
  const values = [
    name, category, price, stock,
    images, brand, origin,
    description, ingredients,
    usage, storage,
    id
  ];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;


