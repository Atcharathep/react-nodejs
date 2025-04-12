-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2025 at 09:56 PM
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
-- Database: `bakery_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL COMMENT 'รหัสคำสั่งจอง (Primary Key)',
  `user_id` int(11) DEFAULT NULL COMMENT 'รหัสลูกค้า (Foreign Key จาก users)',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT 'ราคารวมของคำสั่งจอง',
  `status` enum('pending','paid','confirmed','cancelled') DEFAULT 'pending' COMMENT 'สถานะคำสั่งจอง (pending, paid, confirmed, cancelled)',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'วันที่และเวลาที่สร้างคำสั่งจอง',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันที่และเวลาที่อัพเดตคำสั่งจอง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลคำสั่งจองของลูกค้า';

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL COMMENT 'รหัสรายการสินค้าในคำสั่งจอง (Primary Key)',
  `order_id` int(11) DEFAULT NULL COMMENT 'รหัสคำสั่งจอง (Foreign Key จาก orders)',
  `product_id` int(11) DEFAULT NULL COMMENT 'รหัสสินค้า (Foreign Key จาก products)',
  `quantity` int(11) DEFAULT NULL COMMENT 'จำนวนสินค้าในคำสั่งจอง',
  `price` decimal(10,2) DEFAULT NULL COMMENT 'ราคาของสินค้าตอนสั่งซื้อ (เก็บไว้เพื่อการคำนวณ)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บรายการสินค้าในแต่ละคำสั่งจอง';

-- --------------------------------------------------------

--
-- Table structure for table `order_status_logs`
--

CREATE TABLE `order_status_logs` (
  `id` int(11) NOT NULL COMMENT 'รหัสบันทึกสถานะคำสั่งจอง (Primary Key)',
  `order_id` int(11) DEFAULT NULL COMMENT 'รหัสคำสั่งจอง (Foreign Key จาก orders)',
  `status` enum('pending','paid','confirmed','cancelled') DEFAULT NULL COMMENT 'สถานะคำสั่งจองที่ถูกบันทึก',
  `changed_at` datetime DEFAULT current_timestamp() COMMENT 'วันที่และเวลาที่สถานะคำสั่งจองเปลี่ยน',
  `note` text DEFAULT NULL COMMENT 'บันทึกเพิ่มเติมเกี่ยวกับการเปลี่ยนแปลงสถานะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลประวัติการเปลี่ยนแปลงสถานะของคำสั่งจอง';

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL COMMENT 'รหัสการชำระเงิน (Primary Key)',
  `order_id` int(11) DEFAULT NULL COMMENT 'รหัสคำสั่งจอง (Foreign Key จาก orders)',
  `payment_date` datetime DEFAULT NULL COMMENT 'วันที่และเวลาที่ชำระเงิน',
  `amount` decimal(10,2) DEFAULT NULL COMMENT 'จำนวนเงินที่ชำระ',
  `payment_slip_url` varchar(500) DEFAULT NULL COMMENT 'URL รูปภาพหลักฐานการชำระเงิน',
  `status` enum('waiting','verified','rejected') DEFAULT 'waiting' COMMENT 'สถานะการชำระเงิน (waiting, verified, rejected)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลการชำระเงินสำหรับคำสั่งจอง';

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL COMMENT 'รหัสสินค้า (Primary Key)',
  `name` varchar(255) NOT NULL COMMENT 'ชื่อสินค้า เช่น เค้กช็อกโกแลต',
  `description` text DEFAULT NULL COMMENT 'คำอธิบายสินค้า',
  `price` decimal(10,2) NOT NULL COMMENT 'ราคาสินค้า (จำนวนทศนิยม 2 ตำแหน่ง)',
  `image_url` varchar(500) DEFAULT NULL COMMENT 'URL ของรูปภาพสินค้า',
  `category_id` int(11) DEFAULT NULL COMMENT 'รหัสประเภทสินค้า (Foreign Key จาก product_categories)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลสินค้าเบเกอรี่';

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `category_id`) VALUES
(48, 'เค้กช็อกโกแลต', 'เค้กช็อกโกแลตเนื้อฟูนุ่ม', 250.00, '/uploads/1744485976694.jpg', 1),
(49, 'คุกกี้ช็อกโกแลตชิป', 'คุกกี้ช็อกโกแลตชิปกรอบนอกนุ่มใน', 120.00, '/uploads/1744486280430.jpg', 2),
(50, 'พายแอปเปิ้ล', 'พายแอปเปิ้ลหวานอมเปรี้ยว', 150.00, '/uploads/1744486498905.jpg', 3),
(51, 'ขนมปังเนยสด', 'ขนมปังเนยสดนุ่มๆ อบสดใหม่', 80.00, '/uploads/1744486540379.jpg', 4),
(58, 'เค้กมะพร้าว', 'เค้กมะพร้าวเนื้อนุ่มหอมหวาน', 220.00, '/uploads/1744486609886.jpg', 1),
(59, 'คุกกี้โอ๊ต', 'คุกกี้โอ๊ตกรอบอร่อย', 130.00, '/uploads/1744486642753.webp', 2),
(60, 'พายสับปะรด', 'พายสับปะรดกรอบนอกนุ่มใน', 140.00, '/uploads/1744486669616.jpg', 3),
(61, 'ขนมปังช็อกโกแลต', 'ขนมปังช็อกโกแลตสอดไส้ช็อกโกแลต', 90.00, '/uploads/1744486701866.jpg', 4);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL COMMENT 'รหัสประเภทสินค้า (Primary Key)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อประเภทสินค้า เช่น เค้ก, ขนมปัง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลประเภทของสินค้าเบเกอรี่';

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`) VALUES
(1, 'เค้ก'),
(2, 'คุกกี้'),
(3, 'พาย'),
(4, 'ขนมปัง');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL COMMENT 'รหัสลูกค้า (Primary Key)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อของลูกค้า',
  `email` varchar(100) DEFAULT NULL COMMENT 'อีเมลลูกค้า',
  `phone` varchar(20) DEFAULT NULL COMMENT 'หมายเลขโทรศัพท์ลูกค้า',
  `address` text DEFAULT NULL COMMENT 'ที่อยู่ลูกค้า',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'วันที่เวลาที่ลูกค้าสมัครใช้งาน',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน',
  `role` enum('admin','customer') DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางเก็บข้อมูลลูกค้า';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `address`, `created_at`, `password`, `role`) VALUES
(1, 'Admin', 'admin@gmail.com', '0806686337', 'อุบลราชธานี', '2025-04-06 19:16:54', '$2b$10$7nhJ39nnLNEXiPzqjA3OeO1C1lBNbZX2Eo27zxcZazaiAHz1qITL.', 'admin'),
(2, 'นายอัจฉราเทพ แสงแดง', 'atcharathepsangdang@gmail.com', '0806686338', 'อุบลราชธานี', '2025-04-06 19:38:23', '$2b$10$2aVcJhms7oU.522Jr7YO9uAafd1hAHYuUKWQ4Fdaf5Vv1zJpVHvw.', 'customer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสคำสั่งจอง (Primary Key)';

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการสินค้าในคำสั่งจอง (Primary Key)';

--
-- AUTO_INCREMENT for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสบันทึกสถานะคำสั่งจอง (Primary Key)';

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสการชำระเงิน (Primary Key)';

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสสินค้า (Primary Key)', AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสประเภทสินค้า (Primary Key)', AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'รหัสลูกค้า (Primary Key)', AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD CONSTRAINT `order_status_logs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
