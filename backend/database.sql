
-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS document_db;
CREATE DATABASE document_db;
USE document_db;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  bank_info VARCHAR(255) DEFAULT NULL,
  momo_number VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  file_path VARCHAR(255),
  user_id INT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  category VARCHAR(100),
  price DECIMAL(10, 2) DEFAULT 0.00,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  downloads_limit INT NOT NULL,
  uploads_limit INT NOT NULL,
  max_document_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create document_access table for managing permissions
CREATE TABLE document_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  user_id INT NOT NULL,
  access_type ENUM('read', 'edit', 'owner') DEFAULT 'read',
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (document_id, user_id)
);

-- Create table for transaction history
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type ENUM('deposit', 'purchase', 'sale', 'withdrawal', 'subscription') NOT NULL,
  reference_id INT DEFAULT NULL,
  description TEXT,
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create withdrawal requests table
CREATE TABLE withdrawal_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('bank_transfer', 'momo') NOT NULL,
  status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create table to track document uploads by subscription
CREATE TABLE user_document_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT NOT NULL,
  uploads_used INT DEFAULT 0,
  downloads_used INT DEFAULT 0,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, subscription_id, month_year)
);

-- Create system settings table
CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sample user data
INSERT INTO users (name, email, password, balance) VALUES 
('Admin User', 'admin@example.com', '$2b$10$6oXTmRIMI0AmCFVJfQWkreOZJezTvPXtDVlNJr/enIYk3UhJCkJ8e', 100000.00); -- Password: admin123

-- Create sample documents
INSERT INTO documents (title, description, user_id, is_featured, is_premium, category, price) VALUES 
('Getting Started Guide', 'A comprehensive guide for new users', 1, 1, 1, 'Tutorial', 20000.00),
('Sample Contract', 'A template for standard contracts', 1, 1, 0, 'Legal', 0.00),
('Research Paper', 'Academic research on document management', 1, 0, 1, 'Academic', 15000.00),
('Giáo Trình Toán Cao Cấp', 'Tài liệu giảng dạy môn Toán cao cấp dành cho sinh viên', 1, 1, 1, 'Giáo Dục', 35000.00),
('Hướng Dẫn Marketing Online', 'Chiến lược marketing online hiệu quả cho doanh nghiệp', 1, 1, 1, 'Marketing', 28000.00),
('Luật Doanh Nghiệp Cập Nhật', 'Tài liệu về Luật Doanh Nghiệp mới nhất', 1, 0, 0, 'Pháp Luật', 0.00),
('Luyện Thi TOEIC 900+', 'Phương pháp và bài tập luyện thi TOEIC đạt điểm cao', 1, 1, 1, 'Ngoại Ngữ', 40000.00),
('Sách Dạy Nấu Ăn Cơ Bản', 'Hướng dẫn nấu các món ăn cơ bản cho người mới bắt đầu', 1, 0, 0, 'Ẩm Thực', 0.00);

-- Insert document access records
INSERT INTO document_access (document_id, user_id, access_type) VALUES
(2, 1, 'owner'),
(6, 1, 'owner'),
(8, 1, 'owner');

-- Create subscription plan defaults
INSERT INTO subscriptions (user_id, plan_name, price, end_date, status, downloads_limit, uploads_limit, max_document_price) VALUES
(1, 'Cao Cấp', 100000, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY), 'active', 30, 10, 40000);

-- Add system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('service_fee_percentage', '10', 'Phần trăm phí dịch vụ khi bán tài liệu'),
('min_withdrawal_amount', '50000', 'Số tiền tối thiểu có thể rút'),
('max_file_size_mb', '50', 'Kích thước tối đa của file tài liệu (MB)'),
('featured_document_count', '5', 'Số lượng tài liệu nổi bật hiển thị trên trang chủ');

-- Add sample transactions
INSERT INTO transactions (user_id, amount, transaction_type, description) VALUES
(1, 100000.00, 'deposit', 'Nạp tiền khởi tạo tài khoản'),
(1, 100000.00, 'subscription', 'Đăng ký gói Cao Cấp');
