// routes/product.js
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
  const product = req.body;
  const query = `
    INSERT INTO products 
    (name, activeIngredient, price, stock, category, form, strength, packaging, uses, shortDescription, detailedDescription, img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    product.name,
    product.activeIngredient,
    product.price,
    product.stock,
    product.category,
    product.form,
    product.strength,
    product.packaging,
    product.uses,
    product.shortDescription,
    product.detailedDescription,
    product.img
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...product });
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
  const product = req.body;

  const query = `
    UPDATE products SET 
    name=?, activeIngredient=?, price=?, stock=?, category=?, form=?, strength=?, packaging=?, uses=?, shortDescription=?, detailedDescription=?, img=?
    WHERE id = ?`;

  const values = [
    product.name,
    product.activeIngredient,
    product.price,
    product.stock,
    product.category,
    product.form,
    product.strength,
    product.packaging,
    product.uses,
    product.shortDescription,
    product.detailedDescription,
    product.img,
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;


