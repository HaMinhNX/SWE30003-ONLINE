-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2025 at 06:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('Doctor','Pharmacist','Manager') DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `name`, `email`, `role`, `store_id`) VALUES
(1, 5, 'Võ Văn E', 'manager@longchau.com', 'Manager', 1),
(2, 3, 'Lê Văn C', 'pharmacist1@longchau.com', 'Pharmacist', 1),
(3, 4, 'Phạm Thị D', 'pharmacist2@longchau.com', 'Pharmacist', 2),
(4, 9, 'Cao Văn I', 'pharmacist3@longchau.com', 'Pharmacist', 3);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
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
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `patient_email` varchar(100) NOT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescription_items`
--

CREATE TABLE `prescription_items` (
  `id` int(11) NOT NULL,
  `prescription_id` int(11) DEFAULT NULL,
  `medicine_name` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `reviews` int(11) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `brand` varchar(100) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `usage` text DEFAULT NULL,
  `storage` text DEFAULT NULL,
  `warnings` text DEFAULT NULL,
  `expiry` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `rating`, `reviews`, `images`, `stock`, `brand`, `origin`, `description`, `ingredients`, `usage`, `storage`, `warnings`, `expiry`) VALUES
(1, 'Paracetamol 500mg', 'Thuốc giảm đau', 73236.00, 4.50, 93, '/placeholder.svg', 99, 'Stada', 'Mỹ', 'Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.', 'Paracetamol 500mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '13 tháng kể từ ngày sản xuất'),
(2, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 185788.00, 4.40, 325, '/placeholder.svg', 39, 'Domesco', 'Đức', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '28 tháng kể từ ngày sản xuất'),
(3, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 185788.00, 4.40, 325, '/placeholder.svg', 39, 'Domesco', 'Đức', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '28 tháng kể từ ngày sản xuất'),
(4, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 233163.00, 4.50, 225, '/placeholder.svg', 42, 'GSK', 'Pháp', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '23 tháng kể từ ngày sản xuất'),
(5, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 146473.00, 3.90, 110, '/placeholder.svg', 39, 'Sanofi', 'Pháp', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '35 tháng kể từ ngày sản xuất'),
(6, 'Cetirizine 10mg', 'Thuốc dị ứng', 267623.00, 4.70, 185, '/placeholder.svg', 60, 'DHG Pharma', 'Pháp', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '35 tháng kể từ ngày sản xuất'),
(7, 'Decolgen Forte', 'Thuốc cảm cúm', 184960.00, 4.40, 325, '/placeholder.svg', 30, 'Traphaco', 'Hàn Quốc', 'Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.', 'Paracetamol, Phenylephrine, Chlorpheniramine', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '26 tháng kể từ ngày sản xuất'),
(8, 'Dạ dày Yumangel', 'Thuốc tiêu hóa', 202609.00, 4.00, 297, '/placeholder.svg', 44, 'Traphaco', 'Việt Nam', 'Trung hòa axit dạ dày, giảm đau và ợ chua.', 'Almagate 1.5g', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '29 tháng kể từ ngày sản xuất'),
(9, 'Salonpas Gel', 'Sản phẩm y tế', 132431.00, 4.30, 270, '/placeholder.svg', 40, 'Sanofi', 'Mỹ', 'Giảm đau cơ, đau khớp, căng cơ hiệu quả.', 'Menthol, Methyl salicylate, Camphor', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '20 tháng kể từ ngày sản xuất'),
(10, 'Clorpheniramin 4mg', 'Thuốc dị ứng', 172385.00, 4.70, 375, '/placeholder.svg', 95, 'Stada', 'Mỹ', 'Chống dị ứng, nổi mề đay, viêm mũi dị ứng.', 'Clorpheniramin maleat 4mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '33 tháng kể từ ngày sản xuất'),
(11, 'Efferalgan Codein', 'Thuốc giảm đau', 97040.00, 4.00, 267, '/placeholder.svg', 94, 'GSK', 'Mỹ', 'Giảm đau trung bình đến nặng có kèm ho.', 'Paracetamol 500mg, Codein phosphate 30mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '28 tháng kể từ ngày sản xuất'),
(12, 'Paracetamol 500mg', 'Thuốc giảm đau', 289879.00, 3.90, 223, '/placeholder.svg', 75, 'Stada', 'Việt Nam', 'Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.', 'Paracetamol 500mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '15 tháng kể từ ngày sản xuất'),
(13, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 130470.00, 4.50, 25, '/placeholder.svg', 55, 'Traphaco', 'Mỹ', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '19 tháng kể từ ngày sản xuất'),
(14, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 71103.00, 4.20, 245, '/placeholder.svg', 19, 'Sanofi', 'Mỹ', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '26 tháng kể từ ngày sản xuất'),
(15, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 270044.00, 4.50, 328, '/placeholder.svg', 16, 'Domesco', 'Việt Nam', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '27 tháng kể từ ngày sản xuất'),
(16, 'Cetirizine 10mg', 'Thuốc dị ứng', 264839.00, 4.90, 348, '/placeholder.svg', 34, 'Domesco', 'Hàn Quốc', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '16 tháng kể từ ngày sản xuất'),
(17, 'Decolgen Forte', 'Thuốc cảm cúm', 70398.00, 4.80, 311, '/placeholder.svg', 29, 'Sanofi', 'Nhật Bản', 'Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.', 'Paracetamol, Phenylephrine, Chlorpheniramine', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '22 tháng kể từ ngày sản xuất'),
(18, 'Dạ dày Yumangel', 'Thuốc tiêu hóa', 68049.00, 4.30, 392, '/placeholder.svg', 59, 'DHG Pharma', 'Mỹ', 'Trung hòa axit dạ dày, giảm đau và ợ chua.', 'Almagate 1.5g', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '20 tháng kể từ ngày sản xuất'),
(19, 'Salonpas Gel', 'Sản phẩm y tế', 280031.00, 4.60, 391, '/placeholder.svg', 44, 'GSK', 'Pháp', 'Giảm đau cơ, đau khớp, căng cơ hiệu quả.', 'Menthol, Methyl salicylate, Camphor', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '26 tháng kể từ ngày sản xuất'),
(20, 'Clorpheniramin 4mg', 'Thuốc dị ứng', 298439.00, 4.30, 28, '/placeholder.svg', 42, 'GSK', 'Hàn Quốc', 'Chống dị ứng, nổi mề đay, viêm mũi dị ứng.', 'Clorpheniramin maleat 4mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '36 tháng kể từ ngày sản xuất'),
(21, 'Efferalgan Codein', 'Thuốc giảm đau', 224910.00, 4.20, 126, '/placeholder.svg', 58, 'GSK', 'Việt Nam', 'Giảm đau trung bình đến nặng có kèm ho.', 'Paracetamol 500mg, Codein phosphate 30mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '16 tháng kể từ ngày sản xuất'),
(22, 'Paracetamol 500mg', 'Thuốc giảm đau', 66385.00, 4.20, 228, '/placeholder.svg', 95, 'Sanofi', 'Hàn Quốc', 'Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.', 'Paracetamol 500mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '34 tháng kể từ ngày sản xuất'),
(23, 'Vitamin C 1000mg', 'Thực phẩm chức năng', 129502.00, 4.70, 87, '/placeholder.svg', 87, 'Sanofi', 'Việt Nam', 'Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.', 'Acid Ascorbic (Vitamin C) 1000mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '17 tháng kể từ ngày sản xuất'),
(24, 'Omeprazole 20mg', 'Thuốc tiêu hóa', 299912.00, 4.30, 174, '/placeholder.svg', 71, 'Sanofi', 'Việt Nam', 'Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.', 'Omeprazole 20mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '23 tháng kể từ ngày sản xuất'),
(25, 'Amoxicillin 500mg', 'Thuốc kháng sinh', 278052.00, 4.70, 112, '/placeholder.svg', 57, 'Domesco', 'Đức', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.', 'Amoxicillin trihydrate tương đương 500mg Amoxicillin', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '26 tháng kể từ ngày sản xuất'),
(26, 'Cetirizine 10mg', 'Thuốc dị ứng', 275966.00, 3.80, 143, '/placeholder.svg', 98, 'Traphaco', 'Đức', 'Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.', 'Cetirizine dihydrochloride 10mg', 'Theo chỉ dẫn của bác sĩ', 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp', 'Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.', '12 tháng kể từ ngày sản xuất');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `manager` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `revenue` decimal(15,2) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `pharmacist_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `manager`, `address`, `revenue`, `manager_id`, `pharmacist_id`) VALUES
(1, 'Long Châu Hoàn Kiếm', 'Lê Văn C', '11 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 55000000.00, 5, 3),
(2, 'Long Châu Tây Hồ', 'Phạm Thị D', '22 Võ Chí Công, Tây Hồ, Hà Nội', 49000000.00, 5, 4),
(3, 'Long Châu Nam Từ Liêm', 'Nguyễn Văn Dược 3', '33 Hàm Nghi, Nam Từ Liêm, Hà Nội', 53000000.00, 5, 9);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('Customer','Doctor','Pharmacist','Manager','Admin') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Nguyễn Văn A', 'admin@longchau.com', '123456', 'Admin', '2025-07-23 13:38:22'),
(2, 'Trần Thị B', 'doctor@longchau.com', '123456', 'Doctor', '2025-07-23 13:38:22'),
(3, 'Lê Văn C', 'pharmacist1@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22'),
(4, 'Phạm Thị D', 'pharmacist2@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22'),
(5, 'Võ Văn E', 'manager@longchau.com', '123456', 'Manager', '2025-07-23 13:38:22'),
(6, 'Nguyễn Thị F', 'customer1@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(7, 'Đỗ Văn G', 'customer2@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(8, 'Lý Thị H', 'customer3@longchau.com', '123456', 'Customer', '2025-07-23 13:38:22'),
(9, 'Cao Văn I', 'pharmacist3@longchau.com', '123456', 'Pharmacist', '2025-07-23 13:38:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescription_id` (`prescription_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescription_items`
--
ALTER TABLE `prescription_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD CONSTRAINT `prescription_items_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
