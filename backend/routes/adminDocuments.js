
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
        const dir = 'uploads/documents';
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
            SELECT d.*, c.name as category_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
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
                category_id, is_premium, price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            title,
            description,
            file.path,
            file.size,
            file.mimetype,
            category_id || null,
            is_premium === 'true',
            price || null
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

module.exports = router;
