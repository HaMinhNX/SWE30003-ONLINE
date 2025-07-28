// routes/prescription.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Save prescription
router.post('/', (req, res) => {
  const { patientEmail, doctorName, items } = req.body;
  if (!patientEmail || !doctorName || !items?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert prescription metadata
  db.query(
    'INSERT INTO prescriptions (patient_email, doctor_name, status, created_at) VALUES (?, ?, ?, NOW())',
    [patientEmail, doctorName, 'pending'],
    (err, result) => {
      if (err) {
        console.error('Insert prescription error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      const prescriptionId = result.insertId;

      // Build bulk‑insert array
      const values = items.map(item => [
        prescriptionId,
        item.medicine.name,
        item.medicine.type,
        item.dosage,
        item.quantity,
        item.instructions
      ]);

      db.query(
        'INSERT INTO prescription_items (prescription_id, medicine_name, type, dosage, quantity, instructions) VALUES ?',
        [values],
        (err) => {
          if (err) {
            console.error('Insert items error:', err);
            return res.status(500).json({ error: 'Server error' });
          }
          res.json({ success: true });
        }
      );
    }
  );
});

// GET: Get prescriptions by patient email
router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  db.query(
    'SELECT p.id, p.patient_email, p.doctor_name, p.status, p.created_at, ' +
    'pi.medicine_name, pi.type, pi.dosage, pi.quantity, pi.instructions ' +
    'FROM prescriptions p ' +
    'LEFT JOIN prescription_items pi ON p.id = pi.prescription_id ' +
    'WHERE p.patient_email = ? ' +
    'ORDER BY p.created_at DESC',
    [email],
    (err, rows) => {
      if (err) {
        console.error('Get prescriptions error:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      // group rows into prescriptions with items array
      const grouped = rows.reduce((acc, row) => {
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            patient_email: row.patient_email,
            doctor_name: row.doctor_name,
            status: row.status,
            created_at: row.created_at,
            items: []
          };
        }
        if (row.medicine_name) {
          acc[row.id].items.push({
            medicine: { name: row.medicine_name, type: row.type },
            dosage: row.dosage,
            quantity: row.quantity,
            instructions: row.instructions
          });
        }
        return acc;
      }, {});
      res.json(Object.values(grouped));
    }
  );
});

module.exports = router;
