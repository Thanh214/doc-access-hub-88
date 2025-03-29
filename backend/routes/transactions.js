const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Nạp tiền
router.post('/deposit', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        if (amount <= 0) {
            return res.status(400).json({ message: 'Số tiền nạp không hợp lệ' });
        }

        // Tạo giao dịch nạp tiền
        const transactionQuery = `
            INSERT INTO transactions (user_id, type, amount, status, description)
            VALUES (?, 'deposit', ?, 'completed', ?)
        `;
        db.query(transactionQuery, [
            userId,
            amount,
            `Nạp tiền: ${amount}đ`
        ], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi tạo giao dịch', error: err.message });
            }

            // Cập nhật số dư
            const updateBalanceQuery = 'UPDATE users SET balance = balance + ? WHERE id = ?';
            db.query(updateBalanceQuery, [amount, userId], (err) => {
                if (err) {
                    return res.status(400).json({ message: 'Lỗi cập nhật số dư', error: err.message });
                }
                res.status(201).json({ message: 'Nạp tiền thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy lịch sử giao dịch
router.get('/history', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT * FROM transactions 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy số dư hiện tại
router.get('/balance', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = 'SELECT balance FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json({ balance: results[0].balance });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy thống kê giao dịch (chỉ admin)
router.get('/stats', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        const userQuery = 'SELECT role FROM users WHERE id = ?';
        db.query(userQuery, [req.user.id], (err, userResults) => {
            if (err || userResults.length === 0 || userResults[0].role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
            }

            const query = `
                SELECT 
                    type,
                    COUNT(*) as total_count,
                    SUM(amount) as total_amount,
                    DATE(created_at) as date
                FROM transactions
                WHERE status = 'completed'
                GROUP BY type, DATE(created_at)
                ORDER BY date DESC
            `;
            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Lỗi server', error: err.message });
                }
                res.json(results);
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router; 