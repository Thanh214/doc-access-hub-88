
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
  bank_info JSON DEFAULT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
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
  transaction_id VARCHAR(50) UNIQUE,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type ENUM('deposit', 'purchase', 'sale', 'withdrawal', 'subscription') NOT NULL,
  payment_method ENUM('bank_transfer', 'momo', 'zalopay', 'balance', 'credit_card') NOT NULL,
  reference_id INT DEFAULT NULL,
  description TEXT,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create bank accounts table
CREATE TABLE bank_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, account_number)
);

-- Create system bank accounts for receiving payments
CREATE TABLE system_bank_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  qr_code_url VARCHAR(255),
  instructions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create payment methods table
CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  payment_type ENUM('bank_transfer', 'e_wallet', 'credit_card', 'other') NOT NULL,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bank transfer requests table
CREATE TABLE bank_transfer_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_id VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  system_bank_account_id INT NOT NULL,
  reference_code VARCHAR(50) NOT NULL,
  transfer_note VARCHAR(255) NOT NULL,
  proof_image_url VARCHAR(255),
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (system_bank_account_id) REFERENCES system_bank_accounts(id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

-- Create withdrawal requests table
CREATE TABLE withdrawal_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_id VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  bank_account_id INT,
  payment_method ENUM('bank_transfer', 'momo', 'zalopay') NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
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

-- Create payment verification logs
CREATE TABLE payment_verification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(50),
  verification_type ENUM('manual', 'api', 'webhook') NOT NULL,
  request_data JSON,
  response_data JSON,
  is_successful BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  verified_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

-- Create sample user data
INSERT INTO users (name, email, password, balance) VALUES 
('Admin User', 'admin@example.com', '$2b$10$6oXTmRIMI0AmCFVJfQWkreOZJezTvPXtDVlNJr/enIYk3UhJCkJ8e', 100000.00), -- Password: admin123
('Test User', 'user@example.com', '$2b$10$6oXTmRIMI0AmCFVJfQWkreOZJezTvPXtDVlNJr/enIYk3UhJCkJ8e', 50000.00); -- Password: admin123

-- Insert payment methods
INSERT INTO payment_methods (name, description, payment_type, is_active) VALUES
('Chuyển khoản ngân hàng', 'Chuyển khoản đến tài khoản ngân hàng của hệ thống', 'bank_transfer', TRUE),
('Ví Momo', 'Thanh toán qua ứng dụng Ví Momo', 'e_wallet', TRUE),
('ZaloPay', 'Thanh toán qua ứng dụng ZaloPay', 'e_wallet', TRUE),
('Thẻ tín dụng/ghi nợ', 'Thanh toán bằng thẻ Visa, Mastercard, JCB', 'credit_card', TRUE);

-- Insert system bank accounts
INSERT INTO system_bank_accounts (bank_name, account_number, account_holder, branch, instructions) VALUES
('Vietcombank', '1234567890', 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN', 'Chi nhánh Hà Nội', 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản'),
('Techcombank', '0987654321', 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN', 'Chi nhánh TP.HCM', 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản'),
('MB Bank', '1122334455', 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN', 'Chi nhánh Đà Nẵng', 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản');

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
('featured_document_count', '5', 'Số lượng tài liệu nổi bật hiển thị trên trang chủ'),
('bank_transfer_prefix', 'TAILIEUONLINE', 'Tiền tố cho mã chuyển khoản ngân hàng'),
('payment_verification_mode', 'manual', 'Chế độ xác minh thanh toán: manual, api, hoặc webhook'),
('bank_api_endpoint', '', 'API endpoint để kiểm tra giao dịch ngân hàng'),
('bank_api_key', '', 'API key để xác thực với API ngân hàng');

-- Add sample transactions
INSERT INTO transactions (transaction_id, user_id, amount, transaction_type, payment_method, description, status) VALUES
('TRX-12345678', 1, 100000.00, 'deposit', 'bank_transfer', 'Nạp tiền khởi tạo tài khoản', 'completed'),
('TRX-23456789', 1, 100000.00, 'subscription', 'balance', 'Đăng ký gói Cao Cấp', 'completed'),
('TRX-34567890', 2, 50000.00, 'deposit', 'momo', 'Nạp tiền qua Momo', 'completed');

-- Add sample bank accounts
INSERT INTO bank_accounts (user_id, bank_name, account_number, account_holder, branch, is_primary) VALUES
(1, 'Vietcombank', '9876543210', 'Nguyễn Văn Admin', 'Chi nhánh Hà Nội', TRUE),
(2, 'Techcombank', '5432167890', 'Trần Thị User', 'Chi nhánh TP.HCM', TRUE);

-- Add sample bank transfer request
INSERT INTO bank_transfer_requests (user_id, transaction_id, amount, system_bank_account_id, reference_code, transfer_note, status) VALUES
(1, 'TRX-12345678', 100000.00, 1, 'REF-123456', 'TAILIEUONLINE NAP100K admin@example.com', 'verified');
