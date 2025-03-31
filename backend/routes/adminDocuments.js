const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/documents');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Lấy danh sách tài liệu (chỉ admin)
router.get('/', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const query = `
            SELECT d.*, c.name as category_name, u.username as uploader_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            LEFT JOIN users u ON d.uploader_id = u.id
            ORDER BY d.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Upload tài liệu mới (chỉ admin)
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { title, description, category_id, is_premium, price } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
        }

        const query = `
            INSERT INTO documents (
                title, description, file_path, file_size, file_type, 
                category_id, is_premium, price, uploader_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            title,
            description,
            file.path,
            file.size,
            file.mimetype,
            category_id || null,
            is_premium === 'true',
            price || null,
            req.user.id  // Thêm ID người dùng đăng tài liệu
        ], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi upload tài liệu', error: err.message });
            }
            res.status(201).json({ 
                message: 'Upload tài liệu thành công',
                document_id: result.insertId
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Cập nhật tài liệu (chỉ admin)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { id } = req.params;
        const { title, description, category_id, is_premium, price } = req.body;
        const file = req.file;

        // Kiểm tra tài liệu có tồn tại không
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = results[0];
            let filePath = document.file_path;
            let fileSize = document.file_size;
            let fileType = document.file_type;

            // Nếu có file mới, cập nhật thông tin file
            if (file) {
                // Xóa file cũ nếu tồn tại
                if (fs.existsSync(document.file_path)) {
                    fs.unlinkSync(document.file_path);
                }
                filePath = file.path;
                fileSize = file.size;
                fileType = file.mimetype;
            }

            const query = `
                UPDATE documents 
                SET title = ?, description = ?, file_path = ?, file_size = ?, 
                    file_type = ?, category_id = ?, is_premium = ?, price = ?
                WHERE id = ?
            `;

            db.query(query, [
                title,
                description,
                filePath,
                fileSize,
                fileType,
                category_id || null,
                is_premium === 'true',
                price || null,
                id
            ], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Lỗi cập nhật tài liệu', error: err.message });
                }
                res.json({ message: 'Cập nhật tài liệu thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa tài liệu (chỉ admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { id } = req.params;

        // Kiểm tra tài liệu có tồn tại không
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = results[0];

            // Xóa file nếu tồn tại
            if (fs.existsSync(document.file_path)) {
                fs.unlinkSync(document.file_path);
            }

            // Xóa dữ liệu từ database
            db.query('DELETE FROM documents WHERE id = ?', [id], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Lỗi xóa tài liệu', error: err.message });
                }
                res.json({ message: 'Xóa tài liệu thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Preview tài liệu (chỉ admin)
router.get('/:id/preview', auth, async (req, res) => {
    try {
        console.log('Accessed admin document preview route');
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { id } = req.params;
        
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Lỗi truy vấn database', error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }
            
            const document = results[0];
            const filePath = document.file_path;
            
            console.log('File path:', filePath);
            
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(filePath)) {
                console.error('File không tồn tại:', filePath);
                return res.status(404).json({ message: 'File không tồn tại' });
            }
            
            // Xác định loại file và xử lý phù hợp
            const fileType = document.file_type?.toLowerCase() || '';
            console.log('File type:', fileType);
            
            if (fileType.includes('pdf')) {
                // PDF files
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
                fs.createReadStream(filePath).pipe(res);
            } 
            else if (fileType.includes('image')) {
                // Image files
                res.setHeader('Content-Type', document.file_type);
                res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
                fs.createReadStream(filePath).pipe(res);
            }
            else if (fileType.includes('text') || fileType.includes('rtf') || fileType.includes('msword')) {
                // Text files
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Lỗi đọc file:', err);
                        return res.status(500).json({ message: 'Lỗi đọc file' });
                    }
                    res.setHeader('Content-Type', 'text/plain');
                    res.send(data);
                });
            } else {
                // Các loại file khác - trả về thông báo không hỗ trợ xem trước
                res.status(200).sendFile(filePath); // Thử gửi file trực tiếp
            }
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Thêm route download tài liệu
router.get('/download/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        db.query('SELECT file_path, file_type, title FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }
            
            const document = results[0];
            if (!fs.existsSync(document.file_path)) {
                return res.status(404).json({ message: 'File không tồn tại' });
            }
            
            // Cập nhật số lượt tải
            db.query('UPDATE documents SET download_count = download_count + 1 WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Lỗi cập nhật lượt tải:', err);
                }
            });
            
            // Trả về file cho người dùng tải xuống
            const fileName = path.basename(document.file_path);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', document.file_type);
            
            const fileStream = fs.createReadStream(document.file_path);
            fileStream.pipe(res);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
