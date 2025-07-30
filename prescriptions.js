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

            // Build bulk‑insert array with enhanced product information
            const values = items.map(item => [
                prescriptionId,
                item.medicine.id,                    // product_id
                item.medicine.name,                  // medicine_name
                item.medicine.type,                  // type
                item.medicine.brand || null,         // brand
                item.medicine.description || null,   // description
                item.medicine.price || 0,            // unit_price
                item.medicine.original_price || null, // original_price
                item.dosage,                         // dosage
                item.quantity,                       // quantity
                item.instructions,                   // instructions
                item.totalPrice || (item.medicine.price * item.quantity) // total_price
            ]);

            // Updated query to include all product details
            db.query(
                `INSERT INTO prescription_items 
                (prescription_id, product_id, medicine_name, type, brand, description, unit_price, original_price, dosage, quantity, instructions, total_price) 
                VALUES ?`,
                [values],
                (err) => {
                    if (err) {
                        console.error('Insert items error:', err);
                        return res.status(500).json({ error: 'Server error inserting items' });
                    }
                    console.log(`Successfully saved prescription ${prescriptionId} with ${items.length} items`);
                    res.json({ success: true, prescriptionId });
                }
            );
        }
    );
});

// GET: Get prescriptions (with optional email filter)
router.get('/', (req, res) => {
    const { email } = req.query;

    // Updated query to fetch all product details
    const baseQuery = `
        SELECT p.id, p.patient_email, p.doctor_name, p.status, p.created_at, 
               pi.product_id, pi.medicine_name, pi.type, pi.brand, pi.description,
               pi.unit_price, pi.original_price, pi.dosage, pi.quantity, 
               pi.instructions, pi.total_price
        FROM prescriptions p 
        LEFT JOIN prescription_items pi ON p.id = pi.prescription_id 
    `;

    if (email) {
        // Get prescriptions for specific patient
        db.query(
            baseQuery + 'WHERE p.patient_email = ? ORDER BY p.created_at DESC',
            [email],
            (err, rows) => {
                if (err) {
                    console.error('Get prescriptions by email error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                // Group rows into prescriptions with enhanced items array
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
                            id: row.product_id,
                            medicine: {
                                id: row.product_id,
                                name: row.medicine_name,
                                type: row.type,
                                brand: row.brand,
                                description: row.description
                            },
                            medicine_name: row.medicine_name,
                            type: row.type,
                            brand: row.brand,
                            description: row.description,
                            price: row.unit_price,
                            unit_price: row.unit_price,
                            original_price: row.original_price,
                            dosage: row.dosage,
                            quantity: row.quantity,
                            instructions: row.instructions,
                            total_price: row.total_price
                        });
                    }
                    return acc;
                }, {});
                res.json(Object.values(grouped));
            }
        );
    } else {
        // Get all prescriptions for pharmacist management
        db.query(
            baseQuery + 'ORDER BY p.created_at DESC',
            (err, rows) => {
                if (err) {
                    console.error('Get all prescriptions error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                console.log('Raw database rows:', rows.length, 'rows');

                // Get patient details for better display
                const getPatientName = (email) => {
                    // This is a fallback - ideally you'd join with users table
                    const name = email.split('@')[0];
                    return name.charAt(0).toUpperCase() + name.slice(1);
                };

                // Group rows into prescriptions with enhanced items array
                const grouped = rows.reduce((acc, row) => {
                    if (!acc[row.id]) {
                        acc[row.id] = {
                            id: row.id,
                            patientId: row.patient_email,
                            patient: {
                                name: getPatientName(row.patient_email),
                                email: row.patient_email,
                                age: 0
                            },
                            doctorName: row.doctor_name,
                            status: row.status,
                            createdAt: row.created_at,
                            items: []
                        };
                    }
                    if (row.medicine_name) {
                        acc[row.id].items.push({
                            id: row.product_id,
                            medicine: {
                                id: row.product_id,
                                name: row.medicine_name,
                                type: row.type,
                                brand: row.brand,
                                description: row.description
                            },
                            medicine_name: row.medicine_name,
                            name: row.medicine_name,
                            type: row.type,
                            category: row.type,
                            brand: row.brand,
                            description: row.description,
                            price: row.unit_price,
                            unit_price: row.unit_price,
                            original_price: row.original_price,
                            dosage: row.dosage,
                            quantity: row.quantity,
                            instructions: row.instructions,
                            total_price: row.total_price
                        });
                    }
                    return acc;
                }, {});

                console.log('Grouped prescriptions:', Object.keys(grouped).length, 'prescriptions');
                res.json(Object.values(grouped));
            }
        );
    }
});

// PUT: Update prescription status
router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be: pending, approved, or rejected' });
    }

    // Validate prescription ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid prescription ID' });
    }

    console.log(`Updating prescription ${id} to status: ${status}`);

    // First check if prescription exists
    db.query(
        'SELECT id, status FROM prescriptions WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                console.error('Error checking prescription:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }

            const currentStatus = results[0].status;
            console.log(`Current status: ${currentStatus}, New status: ${status}`);

            // Update the prescription status
            db.query(
                'UPDATE prescriptions SET status = ?, updated_at = NOW() WHERE id = ?',
                [status, id],
                (err, result) => {
                    if (err) {
                        console.error('Error updating prescription status:', err);
                        return res.status(500).json({ error: 'Failed to update prescription status' });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ error: 'Prescription not found or no changes made' });
                    }

                    console.log(`Successfully updated prescription ${id} from ${currentStatus} to ${status}`);
                    res.json({
                        success: true,
                        message: `Prescription status updated to ${status}`,
                        prescriptionId: parseInt(id),
                        previousStatus: currentStatus,
                        newStatus: status
                    });
                }
            );
        }
    );
});

// GET: Get prescription by ID with full details
router.get('/:id', (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid prescription ID' });
    }

    const query = `
        SELECT p.id, p.patient_email, p.doctor_name, p.status, p.created_at, p.updated_at,
               pi.product_id, pi.medicine_name, pi.type, pi.brand, pi.description,
               pi.unit_price, pi.original_price, pi.dosage, pi.quantity, 
               pi.instructions, pi.total_price
        FROM prescriptions p 
        LEFT JOIN prescription_items pi ON p.id = pi.prescription_id 
        WHERE p.id = ?
        ORDER BY pi.id
    `;

    db.query(query, [id], (err, rows) => {
        if (err) {
            console.error('Get prescription by ID error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // Build prescription object with items
        const prescription = {
            id: rows[0].id,
            patient_email: rows[0].patient_email,
            doctor_name: rows[0].doctor_name,
            status: rows[0].status,
            created_at: rows[0].created_at,
            updated_at: rows[0].updated_at,
            items: []
        };

        // Add items if they exist
        rows.forEach(row => {
            if (row.medicine_name) {
                prescription.items.push({
                    id: row.product_id,
                    medicine: {
                        id: row.product_id,
                        name: row.medicine_name,
                        type: row.type,
                        brand: row.brand,
                        description: row.description
                    },
                    medicine_name: row.medicine_name,
                    type: row.type,
                    brand: row.brand,
                    description: row.description,
                    price: row.unit_price,
                    unit_price: row.unit_price,
                    original_price: row.original_price,
                    dosage: row.dosage,
                    quantity: row.quantity,
                    instructions: row.instructions,
                    total_price: row.total_price
                });
            }
        });

        res.json(prescription);
    });
});

// DELETE: Delete prescription (soft delete by setting status to 'cancelled')
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid prescription ID' });
    }

    // First check if prescription exists and can be deleted
    db.query(
        'SELECT id, status FROM prescriptions WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                console.error('Error checking prescription for deletion:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }

            const currentStatus = results[0].status;

            // Only allow deletion of pending prescriptions
            if (currentStatus !== 'pending') {
                return res.status(400).json({
                    error: `Cannot delete prescription with status '${currentStatus}'. Only pending prescriptions can be deleted.`
                });
            }

            // Soft delete by updating status to 'cancelled'
            db.query(
                'UPDATE prescriptions SET status = ?, updated_at = NOW() WHERE id = ?',
                ['cancelled', id],
                (err, result) => {
                    if (err) {
                        console.error('Error deleting prescription:', err);
                        return res.status(500).json({ error: 'Failed to delete prescription' });
                    }

                    console.log(`Successfully deleted prescription ${id}`);
                    res.json({
                        success: true,
                        message: 'Prescription deleted successfully',
                        prescriptionId: parseInt(id)
                    });
                }
            );
        }
    );
});

// GET: Get prescriptions statistics
router.get('/stats/summary', (req, res) => {
    const query = `
        SELECT 
            status,
            COUNT(*) as count,
            COALESCE(SUM(total_value), 0) as total_value
        FROM prescriptions 
        WHERE status != 'cancelled'
        GROUP BY status
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error getting prescription statistics:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        const stats = {
            pending: { count: 0, total_value: 0 },
            approved: { count: 0, total_value: 0 },
            rejected: { count: 0, total_value: 0 },
            total: { count: 0, total_value: 0 }
        };

        results.forEach(row => {
            if (stats[row.status]) {
                stats[row.status] = {
                    count: row.count,
                    total_value: parseFloat(row.total_value || 0)
                };
            }
        });

        // Calculate totals
        stats.total.count = results.reduce((sum, row) => sum + row.count, 0);
        stats.total.total_value = results.reduce((sum, row) => sum + parseFloat(row.total_value || 0), 0);

        res.json(stats);
    });
});

module.exports = router;