-- Updated prescription_items table to store complete product information
-- Run this to modify your existing table structure

-- First, backup your existing data
CREATE TABLE prescription_items_backup AS SELECT * FROM prescription_items;

-- Drop and recreate the table with enhanced structure
DROP TABLE IF EXISTS prescription_items;

CREATE TABLE prescription_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    product_id INT NULL,                    -- Reference to products table
    medicine_name VARCHAR(255) NOT NULL,    -- Product name
    type VARCHAR(100) NULL,                 -- Category/type
    brand VARCHAR(100) NULL,                -- Brand name
    description TEXT NULL,                  -- Product description
    unit_price DECIMAL(10,2) DEFAULT 0,     -- Price per unit
    original_price DECIMAL(10,2) NULL,      -- Original price (for discounts)
    dosage VARCHAR(255) NULL,               -- Dosage information
    quantity INT NOT NULL DEFAULT 1,        -- Quantity prescribed
    instructions TEXT NULL,                 -- Usage instructions
    total_price DECIMAL(10,2) DEFAULT 0,    -- Total price (unit_price * quantity)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    INDEX idx_prescription_id (prescription_id),
    INDEX idx_product_id (product_id)
);

-- If you have existing data in the backup, you can migrate it with this query:
-- INSERT INTO prescription_items 
-- (prescription_id, medicine_name, type, dosage, quantity, instructions, unit_price, total_price)
-- SELECT 
--     prescription_id, 
--     medicine_name, 
--     type, 
--     dosage, 
--     quantity, 
--     instructions,
--     50000 as unit_price,  -- Default price, update as needed
--     50000 * quantity as total_price
-- FROM prescription_items_backup;

-- Optional: Add indexes for better performance
CREATE INDEX idx_medicine_name ON prescription_items(medicine_name);
CREATE INDEX idx_type ON prescription_items(type);
CREATE INDEX idx_brand ON prescription_items(brand);

-- Update existing prescriptions table if needed
ALTER TABLE prescriptions 
ADD COLUMN total_value DECIMAL(12,2) DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create a trigger to automatically calculate prescription total value
DELIMITER //
CREATE TRIGGER update_prescription_total 
AFTER INSERT ON prescription_items
FOR EACH ROW
BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = NEW.prescription_id
    )
    WHERE id = NEW.prescription_id;
END//

CREATE TRIGGER update_prescription_total_update
AFTER UPDATE ON prescription_items
FOR EACH ROW
BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = NEW.prescription_id
    )
    WHERE id = NEW.prescription_id;
END//

CREATE TRIGGER update_prescription_total_delete
AFTER DELETE ON prescription_items
FOR EACH ROW
BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = OLD.prescription_id
    )
    WHERE id = OLD.prescription_id;
END//
DELIMITER ;

-- Sample query to test the enhanced structure
-- SELECT 
--     p.id as prescription_id,
--     p.patient_email,
--     p.doctor_name,
--     p.status,
--     p.total_value,
--     pi.medicine_name,
--     pi.brand,
--     pi.type,
--     pi.unit_price,
--     pi.quantity,
--     pi.total_price,
--     pi.dosage,
--     pi.instructions
-- FROM prescriptions p
-- LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
-- ORDER BY p.created_at DESC;