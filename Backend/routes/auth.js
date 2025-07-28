  //auth.js

  const express = require('express');
  const router = express.Router();
  const { register, login } = require('../controllers/authController.js');
  const db = require('../db.js');



  // POST /api/auth/register
  router.post('/register', register);

  // POST /api/auth/login
  router.post('/login', login);

  router.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.error('Failed to fetch users:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    });
  });


  module.exports = router;


