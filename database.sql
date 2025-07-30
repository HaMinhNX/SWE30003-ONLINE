
CREATE DATABASE IF NOT EXISTS pharmacy_system;
USE pharmacy_system;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100),
  role ENUM('Customer', 'Doctor', 'Pharmacist', 'Manager', 'Admin') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2),
  reviews INT,
  images TEXT,
  stock INT DEFAULT 0,
  brand VARCHAR(100),
  origin VARCHAR(100),
  description TEXT,
  ingredients TEXT,
  `usage` TEXT,
  storage TEXT,
  warnings TEXT,
  expiry VARCHAR(100)
);

-- STORES
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  manager VARCHAR(100),
  address TEXT,
  revenue DECIMAL(15,2),
  manager_id INT,
  pharmacist_id INT
);

-- EMPLOYEES
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  email VARCHAR(100),
  role ENUM('Doctor', 'Pharmacist', 'Manager'),
  store_id INT
);

-- THÊM NGƯỜI DÙNG
INSERT INTO users (id, name, email, password, role) VALUES
(1, "Nguyễn Văn A", "admin@longchau.com", "123456", "Admin"),
(2, "Trần Thị B", "doctor@longchau.com", "123456", "Doctor"),
(3, "Lê Văn C", "pharmacist1@longchau.com", "123456", "Pharmacist"),
(4, "Phạm Thị D", "pharmacist2@longchau.com", "123456", "Pharmacist"),
(5, "Võ Văn E", "manager@longchau.com", "123456", "Manager"),
(6, "Nguyễn Thị F", "customer1@longchau.com", "123456", "Customer"),
(7, "Đỗ Văn G", "customer2@longchau.com", "123456", "Customer"),
(8, "Lý Thị H", "customer3@longchau.com", "123456", "Customer"),
(9, "Cao Văn I", "pharmacist3@longchau.com", "123456", "Pharmacist");

INSERT INTO products 
(name, category, price, rating, reviews, images, stock, brand, origin, description, ingredients, `usage`, storage, warnings, expiry) 
VALUES
("Paracetamol 500mg", "Thuốc giảm đau", 73236, 4.5, 93, "/placeholder.svg", 99, "Stada", "Mỹ", 
"Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.", "Paracetamol 500mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "13 tháng kể từ ngày sản xuất"),

("Vitamin C 1000mg", "Thực phẩm chức năng", 185788, 4.4, 325, "/placeholder.svg", 39, "Domesco", "Đức", 
"Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.", "Acid Ascorbic (Vitamin C) 1000mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "28 tháng kể từ ngày sản xuất"),

("Vitamin C 1000mg", "Thực phẩm chức năng", 185788, 4.4, 325, "/placeholder.svg", 39, "Domesco", "Đức", 
"Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.", "Acid Ascorbic (Vitamin C) 1000mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "28 tháng kể từ ngày sản xuất"),

("Omeprazole 20mg", "Thuốc tiêu hóa", 233163, 4.5, 225, "/placeholder.svg", 42, "GSK", "Pháp", 
"Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.", "Omeprazole 20mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "23 tháng kể từ ngày sản xuất"),

("Amoxicillin 500mg", "Thuốc kháng sinh", 146473, 3.9, 110, "/placeholder.svg", 39, "Sanofi", "Pháp", 
"Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.", "Amoxicillin trihydrate tương đương 500mg Amoxicillin", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "35 tháng kể từ ngày sản xuất"),

("Cetirizine 10mg", "Thuốc dị ứng", 267623, 4.7, 185, "/placeholder.svg", 60, "DHG Pharma", "Pháp", 
"Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.", "Cetirizine dihydrochloride 10mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "35 tháng kể từ ngày sản xuất"),

("Decolgen Forte", "Thuốc cảm cúm", 184960, 4.4, 325, "/placeholder.svg", 30, "Traphaco", "Hàn Quốc", 
"Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.", "Paracetamol, Phenylephrine, Chlorpheniramine", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "26 tháng kể từ ngày sản xuất"),

("Dạ dày Yumangel", "Thuốc tiêu hóa", 202609, 4.0, 297, "/placeholder.svg", 44, "Traphaco", "Việt Nam", 
"Trung hòa axit dạ dày, giảm đau và ợ chua.", "Almagate 1.5g", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "29 tháng kể từ ngày sản xuất"),

("Salonpas Gel", "Sản phẩm y tế", 132431, 4.3, 270, "/placeholder.svg", 40, "Sanofi", "Mỹ", 
"Giảm đau cơ, đau khớp, căng cơ hiệu quả.", "Menthol, Methyl salicylate, Camphor", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "20 tháng kể từ ngày sản xuất"),

("Clorpheniramin 4mg", "Thuốc dị ứng", 172385, 4.7, 375, "/placeholder.svg", 95, "Stada", "Mỹ", 
"Chống dị ứng, nổi mề đay, viêm mũi dị ứng.", "Clorpheniramin maleat 4mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "33 tháng kể từ ngày sản xuất"),

("Efferalgan Codein", "Thuốc giảm đau", 97040, 4.0, 267, "/placeholder.svg", 94, "GSK", "Mỹ", 
"Giảm đau trung bình đến nặng có kèm ho.", "Paracetamol 500mg, Codein phosphate 30mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "28 tháng kể từ ngày sản xuất"),

("Paracetamol 500mg", "Thuốc giảm đau", 289879, 3.9, 223, "/placeholder.svg", 75, "Stada", "Việt Nam", 
"Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.", "Paracetamol 500mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "15 tháng kể từ ngày sản xuất"),

("Vitamin C 1000mg", "Thực phẩm chức năng", 130470, 4.5, 25, "/placeholder.svg", 55, "Traphaco", "Mỹ", 
"Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.", "Acid Ascorbic (Vitamin C) 1000mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "19 tháng kể từ ngày sản xuất"),

("Omeprazole 20mg", "Thuốc tiêu hóa", 71103, 4.2, 245, "/placeholder.svg", 19, "Sanofi", "Mỹ", 
"Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.", "Omeprazole 20mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "26 tháng kể từ ngày sản xuất"),

("Amoxicillin 500mg", "Thuốc kháng sinh", 270044, 4.5, 328, "/placeholder.svg", 16, "Domesco", "Việt Nam", 
"Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.", "Amoxicillin trihydrate tương đương 500mg Amoxicillin", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "27 tháng kể từ ngày sản xuất"),

("Cetirizine 10mg", "Thuốc dị ứng", 264839, 4.9, 348, "/placeholder.svg", 34, "Domesco", "Hàn Quốc", 
"Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.", "Cetirizine dihydrochloride 10mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "16 tháng kể từ ngày sản xuất"),

("Decolgen Forte", "Thuốc cảm cúm", 70398, 4.8, 311, "/placeholder.svg", 29, "Sanofi", "Nhật Bản", 
"Điều trị cảm cúm, nghẹt mũi, đau đầu và sốt.", "Paracetamol, Phenylephrine, Chlorpheniramine", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "22 tháng kể từ ngày sản xuất"),

("Dạ dày Yumangel", "Thuốc tiêu hóa", 68049, 4.3, 392, "/placeholder.svg", 59, "DHG Pharma", "Mỹ", 
"Trung hòa axit dạ dày, giảm đau và ợ chua.", "Almagate 1.5g", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "20 tháng kể từ ngày sản xuất"),

("Salonpas Gel", "Sản phẩm y tế", 280031, 4.6, 391, "/placeholder.svg", 44, "GSK", "Pháp", 
"Giảm đau cơ, đau khớp, căng cơ hiệu quả.", "Menthol, Methyl salicylate, Camphor", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "26 tháng kể từ ngày sản xuất"),

("Clorpheniramin 4mg", "Thuốc dị ứng", 298439, 4.3, 28, "/placeholder.svg", 42, "GSK", "Hàn Quốc", 
"Chống dị ứng, nổi mề đay, viêm mũi dị ứng.", "Clorpheniramin maleat 4mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "36 tháng kể từ ngày sản xuất"),

("Efferalgan Codein", "Thuốc giảm đau", 224910, 4.2, 126, "/placeholder.svg", 58, "GSK", "Việt Nam", 
"Giảm đau trung bình đến nặng có kèm ho.", "Paracetamol 500mg, Codein phosphate 30mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "16 tháng kể từ ngày sản xuất"),

("Paracetamol 500mg", "Thuốc giảm đau", 66385, 4.2, 228, "/placeholder.svg", 95, "Sanofi", "Hàn Quốc", 
"Thuốc giảm đau hạ sốt phổ biến cho cả người lớn và trẻ em.", "Paracetamol 500mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "34 tháng kể từ ngày sản xuất"),

("Vitamin C 1000mg", "Thực phẩm chức năng", 129502, 4.7, 87, "/placeholder.svg", 87, "Sanofi", "Việt Nam", 
"Giúp tăng cường sức đề kháng, phòng ngừa cảm cúm.", "Acid Ascorbic (Vitamin C) 1000mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "17 tháng kể từ ngày sản xuất"),

("Omeprazole 20mg", "Thuốc tiêu hóa", 299912, 4.3, 174, "/placeholder.svg", 71, "Sanofi", "Việt Nam", 
"Thuốc điều trị viêm loét dạ dày, trào ngược dạ dày thực quản.", "Omeprazole 20mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "23 tháng kể từ ngày sản xuất"),

("Amoxicillin 500mg", "Thuốc kháng sinh", 278052, 4.7, 112, "/placeholder.svg", 57, "Domesco", "Đức", 
"Kháng sinh phổ rộng điều trị nhiễm khuẩn hô hấp, tai-mũi-họng.", "Amoxicillin trihydrate tương đương 500mg Amoxicillin", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "26 tháng kể từ ngày sản xuất"),

("Cetirizine 10mg", "Thuốc dị ứng", 275966, 3.8, 143, "/placeholder.svg", 98, "Traphaco", "Đức", 
"Giảm nhanh triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa da.", "Cetirizine dihydrochloride 10mg", "Theo chỉ dẫn của bác sĩ", 
"Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp", "Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu có bệnh nền.", "12 tháng kể từ ngày sản xuất");


-- THÊM CỬA HÀNG
INSERT INTO stores (id, name, manager, address, revenue, manager_id, pharmacist_id) VALUES
(1, "Long Châu Hoàn Kiếm", "Lê Văn C", "11 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội", 55000000, 5, 3),
(2, "Long Châu Tây Hồ", "Phạm Thị D", "22 Võ Chí Công, Tây Hồ, Hà Nội", 49000000, 5, 4),
(3, "Long Châu Nam Từ Liêm", "Nguyễn Văn Dược 3", "33 Hàm Nghi, Nam Từ Liêm, Hà Nội", 53000000, 5, 9);

-- THÊM NHÂN VIÊN
INSERT INTO employees (user_id, name, email, role, store_id) VALUES
(5, "Võ Văn E", "manager@longchau.com", "Manager", 1),
(3, "Lê Văn C", "pharmacist1@longchau.com", "Pharmacist", 1),
(4, "Phạm Thị D", "pharmacist2@longchau.com", "Pharmacist", 2),
(9, "Cao Văn I", "pharmacist3@longchau.com", "Pharmacist", 3);


CREATE TABLE prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_email VARCHAR(100) NOT NULL,
  doctor_name VARCHAR(100),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE prescription_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT,
  medicine_name VARCHAR(255),
  type VARCHAR(100),
  dosage VARCHAR(100),
  quantity INT,
  instructions TEXT,
  price DECIMAL(10, 2),
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);


CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  user_email VARCHAR(100),
  status ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  payment_method ENUM('cod', 'stripe'),
  created_at DATETIME,
  customer_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  district VARCHAR(100),
  city VARCHAR(100),
  note TEXT
);


CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  product_id INT,
  product_name VARCHAR(255),
  quantity INT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);