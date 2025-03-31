const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const db = require('../config/database');

// Middleware cho tất cả các route admin
router.use(auth);
router.use(checkAdmin);

// Lấy thống kê tổng quan
router.get('/dashboard', async (req, res) => {
    try {
        const stats = {
            totalDocuments: 0,
            totalUsers: 0,
            totalDownloads: 0,
            totalRevenue: 0
        };

        // Đếm tổng số tài liệu
        const docQuery = 'SELECT COUNT(*) as count FROM documents';
        const docResult = await new Promise((resolve, reject) => {
            db.query(docQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results[0].count);
            });
        });
        stats.totalDocuments = docResult;

        // Đếm tổng số người dùng
        const userQuery = 'SELECT COUNT(*) as count FROM users WHERE role != "admin"';
        const userResult = await new Promise((resolve, reject) => {
            db.query(userQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results[0].count);
            });
        });
        stats.totalUsers = userResult;

        // Tính tổng số lượt tải
        const downloadQuery = 'SELECT SUM(download_count) as total FROM documents';
        const downloadResult = await new Promise((resolve, reject) => {
            db.query(downloadQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total || 0);
            });
        });
        stats.totalDownloads = downloadResult;

        // Tính tổng doanh thu
        const revenueQuery = 'SELECT SUM(amount) as total FROM transactions WHERE status = "completed"';
        const revenueResult = await new Promise((resolve, reject) => {
            db.query(revenueQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total || 0);
            });
        });
        stats.totalRevenue = revenueResult;

        res.json(stats);
    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy danh sách người dùng
router.get('/users', async (req, res) => {
    try {
        const query = `
            SELECT id, email, full_name, role, balance, created_at, status
            FROM users
            WHERE role != 'admin'
            ORDER BY created_at DESC
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

// Cập nhật trạng thái người dùng
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const query = 'UPDATE users SET status = ? WHERE id = ?';
        db.query(query, [status, id], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi cập nhật', error: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
            
            res.json({ message: 'Cập nhật thành công' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy lịch sử giao dịch
router.get('/transactions', async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.email, u.full_name
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
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

module.exports = router;
