// routes/prescriptions.js
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

// GET: Get all prescriptions (for pharmacist management)
router.get('/', (req, res) => {
    const { email } = req.query;

    // If email is provided, get prescriptions for specific patient
    if (email) {
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

                // Group rows into prescriptions with items array
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
    } else {
        // Get all prescriptions with patient info (for pharmacist management)
        db.query(
            `SELECT 
        p.id, 
        p.patient_email, 
        p.doctor_name, 
        p.status, 
        p.created_at,
        u.name as patient_name,
        u.age as patient_age,
        pi.medicine_name, 
        pi.type, 
        pi.dosage, 
        pi.quantity, 
        pi.instructions 
      FROM prescriptions p 
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id 
      LEFT JOIN users u ON p.patient_email = u.email
      ORDER BY p.created_at DESC`,
            (err, rows) => {
                if (err) {
                    console.error('Get all prescriptions error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                // Group rows into prescriptions with items array
                const grouped = rows.reduce((acc, row) => {
                    if (!acc[row.id]) {
                        acc[row.id] = {
                            id: row.id,
                            patientId: row.patient_email,
                            patient: {
                                name: row.patient_name || 'Unknown',
                                email: row.patient_email,
                                age: row.patient_age || 0
                            },
                            doctorName: row.doctor_name,
                            status: row.status,
                            createdAt: row.created_at,
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
    }
});

// PUT: Update prescription status
router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.query(
        'UPDATE prescriptions SET status = ? WHERE id = ?',
        [status, id],
        (err, result) => {
            if (err) {
                console.error('Update prescription status error:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }

            res.json({ success: true });
        }
    );
});

module.exports = router;