
 -- Tạo database
CREATE DATABASE IF NOT EXISTS doc_access_hub;
USE doc_access_hub;

-- Bảng users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    balance DECIMAL(10,2) DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng subscription_packages
CREATE TABLE subscription_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    download_limit INT NOT NULL,
    duration_days INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng user_subscriptions
CREATE TABLE user_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NULL,  -- Thay đổi ở đây
    remaining_downloads INT NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES subscription_packages(id)
);

-- Bảng categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Bảng documents
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50),
    category_id INT,
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    download_count INT DEFAULT 0,
    uploader_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- Bảng download_history
CREATE TABLE download_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_id INT NOT NULL,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    amount_paid DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Bảng transactions
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('deposit', 'purchase', 'subscription') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Thêm dữ liệu mẫu cho subscription_packages
INSERT INTO subscription_packages (name, price, download_limit, duration_days, description) VALUES
('Gói Cơ Bản', 50000, 10, 30, 'Gói cơ bản cho người dùng mới'),
('Gói Tiêu Chuẩn', 100000, 30, 30, 'Gói tiêu chuẩn cho người dùng thường xuyên'),
('Gói Cao Cấp', 200000, 100, 30, 'Gói cao cấp cho người dùng chuyên nghiệp');

-- Thêm tài khoản admin mặc định
-- Mật khẩu: admin123 (đã được mã hóa bằng bcrypt)
INSERT INTO users (email, password, full_name, role, balance) VALUES 
('admin@tailieuvn.com', '$2a$10$8OuAgqj.SdXnGHXz0S0Jz.YYT4hFHx.yo0XG2c.YuoQsKZiKJ5YyG', 'Administrator', 'admin', 0);

-- Nếu đã có bảng documents, hãy thêm trường uploader_id
-- ALTER TABLE documents ADD COLUMN uploader_id INT AFTER download_count;
-- ALTER TABLE documents ADD FOREIGN KEY (uploader_id) REFERENCES users(id);
