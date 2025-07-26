const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a prescription
router.post('/', (req, res) => {
  const { patientEmail, doctorName, items } = req.body;

  if (!patientEmail || !items?.length) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const sqlPres = `INSERT INTO prescriptions (patient_email, doctor_name) VALUES (?, ?)`;
  db.query(sqlPres, [patientEmail, doctorName], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const presId = result.insertId;
    const values = items.map(item => [
      presId,
      item.name,
      item.type,
      item.dosage,
      item.quantity,
      item.instructions,
      item.price || 0
    ]);

    const sqlItems = `
      INSERT INTO prescription_items 
      (prescription_id, medicine_name, type, dosage, quantity, instructions, price) 
      VALUES ?
    `;

    db.query(sqlItems, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, prescriptionId: presId });
    });
  });
});

// Get prescriptions by user email
router.get('/', (req, res) => {
  const { email } = req.query;
  const sql = `
    SELECT p.*, i.id AS item_id, i.medicine_name, i.type, i.dosage, i.quantity, i.instructions, i.price
    FROM prescriptions p
    LEFT JOIN prescription_items i ON p.id = i.prescription_id
    WHERE p.patient_email = ?
    ORDER BY p.created_at DESC
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const prescriptions = {};
    for (const row of rows) {
      if (!prescriptions[row.id]) {
        prescriptions[row.id] = {
          id: row.id,
          doctorName: row.doctor_name,
          createdAt: row.created_at,
          status: row.status,
          items: []
        };
      }

      if (row.item_id) {
        prescriptions[row.id].items.push({
          id: row.item_id,
          name: row.medicine_name,
          type: row.type,
          dosage: row.dosage,
          quantity: row.quantity,
          instructions: row.instructions,
          price: row.price
        });
      }
    }

    res.json(Object.values(prescriptions));
  });
});

module.exports = router;
