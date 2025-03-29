const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Lấy danh sách danh mục
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name';
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

// Tạo danh mục mới (chỉ admin)
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, parent_id } = req.body;

        // Kiểm tra quyền admin
        const userQuery = 'SELECT role FROM users WHERE id = ?';
        db.query(userQuery, [req.user.id], (err, userResults) => {
            if (err || userResults.length === 0 || userResults[0].role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
            }

            const query = 'INSERT INTO categories (name, description, parent_id) VALUES (?, ?, ?)';
            db.query(query, [name, description, parent_id], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Lỗi tạo danh mục', error: err.message });
                }
                res.status(201).json({ message: 'Tạo danh mục thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Cập nhật danh mục (chỉ admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, parent_id } = req.body;

        // Kiểm tra quyền admin
        const userQuery = 'SELECT role FROM users WHERE id = ?';
        db.query(userQuery, [req.user.id], (err, userResults) => {
            if (err || userResults.length === 0 || userResults[0].role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
            }

            const query = 'UPDATE categories SET name = ?, description = ?, parent_id = ? WHERE id = ?';
            db.query(query, [name, description, parent_id, id], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Lỗi cập nhật danh mục', error: err.message });
                }
                res.json({ message: 'Cập nhật danh mục thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa danh mục (chỉ admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra quyền admin
        const userQuery = 'SELECT role FROM users WHERE id = ?';
        db.query(userQuery, [req.user.id], (err, userResults) => {
            if (err || userResults.length === 0 || userResults[0].role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
            }

            // Kiểm tra xem danh mục có tài liệu không
            const checkQuery = 'SELECT COUNT(*) as count FROM documents WHERE category_id = ?';
            db.query(checkQuery, [id], (err, checkResults) => {
                if (err) {
                    return res.status(500).json({ message: 'Lỗi kiểm tra danh mục', error: err.message });
                }

                if (checkResults[0].count > 0) {
                    return res.status(400).json({ message: 'Không thể xóa danh mục đang có tài liệu' });
                }

                const query = 'DELETE FROM categories WHERE id = ?';
                db.query(query, [id], (err, result) => {
                    if (err) {
                        return res.status(400).json({ message: 'Lỗi xóa danh mục', error: err.message });
                    }
                    res.json({ message: 'Xóa danh mục thành công' });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router; 