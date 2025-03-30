
-- Thêm dữ liệu mẫu cho categories
INSERT INTO categories (name, description, parent_id) VALUES 
('Giáo dục', 'Tài liệu giáo dục và học tập', NULL),
('Kinh doanh', 'Tài liệu về kinh doanh và quản lý', NULL),
('Công nghệ', 'Tài liệu về công nghệ và tin học', NULL),
('Luật', 'Tài liệu pháp luật', NULL),
('Y học', 'Tài liệu y học và sức khỏe', NULL),
('Văn học', 'Tài liệu văn học và nghệ thuật', NULL);

-- Thêm danh mục con cho Giáo dục
INSERT INTO categories (name, description, parent_id) VALUES 
('Giáo dục Tiểu học', 'Tài liệu cho cấp tiểu học', 1),
('Giáo dục THCS', 'Tài liệu cho cấp THCS', 1),
('Giáo dục THPT', 'Tài liệu cho cấp THPT', 1),
('Giáo dục Đại học', 'Tài liệu đại học và cao đẳng', 1),
('Tài liệu ôn thi', 'Tài liệu ôn thi các kỳ thi', 1);

-- Thêm danh mục con cho Kinh doanh
INSERT INTO categories (name, description, parent_id) VALUES 
('Marketing', 'Tài liệu về marketing và quảng cáo', 2),
('Quản trị nhân sự', 'Tài liệu về quản lý nhân sự', 2),
('Kế toán & Tài chính', 'Tài liệu về kế toán và tài chính', 2),
('Khởi nghiệp', 'Tài liệu về khởi nghiệp và startup', 2),
('Quản lý dự án', 'Tài liệu về quản lý dự án', 2);

-- Thêm danh mục con cho Công nghệ
INSERT INTO categories (name, description, parent_id) VALUES 
('Lập trình', 'Tài liệu về lập trình và phát triển phần mềm', 3),
('Mạng & Hệ thống', 'Tài liệu về mạng máy tính và hệ thống', 3),
('Trí tuệ nhân tạo', 'Tài liệu về AI và máy học', 3),
('Thiết kế web', 'Tài liệu về thiết kế và phát triển web', 3),
('Bảo mật thông tin', 'Tài liệu về bảo mật và an ninh mạng', 3);
