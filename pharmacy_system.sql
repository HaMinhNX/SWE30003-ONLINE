SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS pharmacy_system ;
CREATE DATABASE IF NOT EXISTS `pharmacy_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pharmacy_system`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('Customer','Doctor','Pharmacist','Manager','Admin') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `manager` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `revenue` decimal(15,2) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `pharmacist_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('Doctor','Pharmacist','Manager') DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `images` text DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `brand` varchar(100) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `usage` text DEFAULT NULL,
  `storage` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `status` enum('pending','confirmed','shipping','delivered','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('cod','stripe') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_email` varchar(100) NOT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `total_value` decimal(12,2) DEFAULT 0.00,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `prescription_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prescription_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT 0.00,
  `original_price` decimal(10,2) DEFAULT NULL,
  `dosage` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `instructions` text DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_prescription_id` (`prescription_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_medicine_name` (`medicine_name`),
  KEY `idx_type` (`type`),
  KEY `idx_brand` (`brand`),
  CONSTRAINT `prescription_items_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DELIMITER $$
CREATE TRIGGER `update_prescription_total` AFTER INSERT ON `prescription_items` FOR EACH ROW BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = NEW.prescription_id
    )
    WHERE id = NEW.prescription_id;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `update_prescription_total_delete` AFTER DELETE ON `prescription_items` FOR EACH ROW BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = OLD.prescription_id
    )
    WHERE id = OLD.prescription_id;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `update_prescription_total_update` AFTER UPDATE ON `prescription_items` FOR EACH ROW BEGIN
    UPDATE prescriptions 
    SET total_value = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM prescription_items 
        WHERE prescription_id = NEW.prescription_id
    )
    WHERE id = NEW.prescription_id;
END
$$
DELIMITER ;

COMMIT;

INSERT INTO `employees` (`id`, `user_id`, `name`, `email`, `role`, `store_id`) VALUES
(1, 5, 'Võ Văn E', 'manager@longchau.com', 'Manager', 1),
(2, 3, 'Lê Văn C', 'pharmacist1@longchau.com', 'Pharmacist', 1),
(3, 4, 'Phạm Thị D', 'pharmacist2@longchau.com', 'Pharmacist', 2),
(4, 9, 'Cao Văn I', 'pharmacist3@longchau.com', 'Pharmacist', 3);


INSERT INTO `products` (`id`, `name`, `category`, `price`, `images`, `stock`, `brand`, `origin`, `description`, `ingredients`, `usage`, `storage`) VALUES
(4, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 233163.00, '/placeholder.svg', 42, 'GSK', 'Pháp', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(5, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 146473.00, '/placeholder.svg', 39, 'Sanofi', 'Pháp', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(6, 'Cetirizine 10mg', 'Thuốc dị ứng', 267623.00, '/placeholder.svg', 60, 'DHG Pharma', 'Pháp', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(7, 'Decolgen Forte', 'Thuốc cảm cúm', 184960.00, '/placeholder.svg', 30, 'Traphaco', 'Hàn Quốc', 'Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.', 'Paracetamol, Phenylephrine, Chlorpheniramine', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(8, 'Dạ dày Yumangel', 'Thuốc tiêu hóa', 202609.00, '/placeholder.svg', 44, 'Traphaco', 'Việt Nam', 'Trung hòa axit dạ dày, giảm đau và ợ chua.', 'Almagate 1.5g', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(9, 'Salonpas Gel', 'Sản phẩm y tế', 132431.00, '/placeholder.svg', 40, 'Sanofi', 'Mỹ', 'Giảm đau cơ, đau khớp, căng cơ hiệu quả.', 'Menthol, Methyl salicylate, Camphor', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(10, 'Clorpheniramin 4mg', 'Thuốc dị ứng', 172385.00, '/placeholder.svg', 95, 'Stada', 'Mỹ', 'Chống dị ứng, nổi mề đay, viêm mũi dị ứng.', 'Clorpheniramin maleat 4mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(11, 'Efferalgan Codein', 'Thuốc giảm đau', 97040.00, '/placeholder.svg', 94, 'GSK', 'Mỹ', 'Giảm đau trung bình đến nặng có kèm ho.', 'Paracetamol 500mg, Codein phosphate 30mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(12, 'Paracetamol 500mg', 'Thuốc giảm đau', 289879.00, '/placeholder.svg', 75, 'Stada', 'Việt Nam', 'Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.', 'Paracetamol 500mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(13, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 130470.00, '/placeholder.svg', 55, 'Traphaco', 'Mỹ', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(14, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 71103.00, '/placeholder.svg', 19, 'Sanofi', 'Mỹ', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(15, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 270044.00, '/placeholder.svg', 16, 'Domesco', 'Việt Nam', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(16, 'Cetirizine 10mg', 'Thuốc dị ứng', 264839.00, '/placeholder.svg', 34, 'Domesco', 'Hàn Quốc', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(17, 'Decolgen Forte', 'Thuốc cảm cúm', 70398.00, '/placeholder.svg', 29, 'Sanofi', 'Nhật Bản', 'Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.', 'Paracetamol, Phenylephrine, Chlorpheniramine', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(18, 'Dạ dày Yumangel', 'Thuốc tiêu hóa', 68049.00, '/placeholder.svg', 59, 'DHG Pharma', 'Mỹ', 'Trung hòa axit dạ dày, giảm đau và ợ chua.', 'Almagate 1.5g', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(19, 'Salonpas Gel', 'Sản phẩm y tế', 280031.00, '/placeholder.svg', 44, 'GSK', 'Pháp', 'Giảm đau cơ, đau khớp, căng cơ hiệu quả.', 'Menthol, Methyl salicylate, Camphor', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(20, 'Clorpheniramin 4mg', 'Thuốc dị ứng', 298439.00, '/placeholder.svg', 42, 'GSK', 'Hàn Quốc', 'Chống dị ứng, nổi mề đay, viêm mũi dị ứng.', 'Clorpheniramin maleat 4mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(21, 'Efferalgan Codein', 'Thuốc giảm đau', 224910.00, '/placeholder.svg', 58, 'GSK', 'Việt Nam', 'Giảm đau trung bình đến nặng có kèm ho.', 'Paracetamol 500mg, Codein phosphate 30mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(22, 'Paracetamol 500mg', 'Thuốc giảm đau', 66385.00, '/placeholder.svg', 95, 'Sanofi', 'Hàn Quốc', 'Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.', 'Paracetamol 500mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(23, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 129502.00, '/placeholder.svg', 87, 'Sanofi', 'Việt Nam', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(24, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 299912.00, '/placeholder.svg', 71, 'Sanofi', 'Việt Nam', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(25, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 278052.00, '/placeholder.svg', 57, 'Domesco', 'Đức', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp'),
(26, 'Cetirizine 10mg', 'Thuốc dị ứng', 275966.00, '/placeholder.svg', 98, 'Traphaco', 'Đức', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp');


INSERT INTO `stores` (`id`, `name`, `manager`, `address`, `revenue`, `manager_id`, `pharmacist_id`) VALUES
(1, 'Long Châu Hoàn Kiếm', 'Lê Văn C', '11 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 55000000.00, 5, 3),
(2, 'Long Châu Tây Hồ', 'Phạm Thị D', '22 Võ Chí Công, Tây Hồ, Hà Nội', 49000000.00, 5, 4),
(3, 'Long Châu Nam Từ Liêm', 'Nguyễn Văn Dược 3', '33 Hàm Nghi, Nam Từ Liêm, Hà Nội', 53000000.00, 5, 9),
(4, 'Long Chau Rau Ma', 'aaaaaaaaaaaaaa', 'VuongQuocNemChua', 0.00, NULL, NULL),
(5, 'aaa', 'aaaa', 'aaaa', 0.00, NULL, NULL);



INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Nguyễn Văn A', 'admin@longchau.com', '123456', 'Admin', '2025-07-23 13:38:22'),
(2, 'Trần Thị B', 'doctor@longchau.com', '123456', 'Doctor', '2025-07-23 13:38:22'),
(3, 'Lê Văn C', 'pharmacist1@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22'),
(4, 'Phạm Thị D', 'pharmacist2@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22'),
(5, 'Võ Văn E', 'manager@longchau.com', '123456', 'Manager', '2025-07-23 13:38:22'),
(6, 'Nguyễn Thị F', 'customer1@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(7, 'Đỗ Văn G', 'customer2@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(8, 'Lý Thị H', 'customer3@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(9, 'Cao Văn I', 'pharmacist3@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22'),
(11, 'Le Thi Dao', 'customer4@longchau', '123456', 'Customer', '2025-07-27 10:55:35'),
(12, 'HelloWorld', 'fakedoctor@longchau.com', '123456', 'Customer', '2025-07-29 10:00:15');
