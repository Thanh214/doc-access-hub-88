
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
  category VARCHAR(100),
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create document_access table for managing permissions
CREATE TABLE document_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  user_id INT NOT NULL,
  access_type ENUM('read', 'edit', 'owner') DEFAULT 'read',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (document_id, user_id)
);

-- Create sample user data
INSERT INTO users (name, email, password) VALUES 
('Admin User', 'admin@example.com', '$2b$10$6oXTmRIMI0AmCFVJfQWkreOZJezTvPXtDVlNJr/enIYk3UhJCkJ8e'); -- Password: admin123

-- Create sample documents
INSERT INTO documents (title, description, user_id, is_featured, category) VALUES 
('Getting Started Guide', 'A comprehensive guide for new users', 1, 1, 'Tutorial'),
('Sample Contract', 'A template for standard contracts', 1, 1, 'Legal'),
('Research Paper', 'Academic research on document management', 1, 0, 'Academic');
