const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Lấy danh sách gói đăng ký
router.get('/packages', async (req, res) => {
    try {
        const query = 'SELECT * FROM subscription_packages';
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

// Đăng ký gói mới
router.post('/subscribe', auth, async (req, res) => {
    try {
        const { package_id } = req.body;
        const userId = req.user.id;

        // Kiểm tra gói có tồn tại không
        const packageQuery = 'SELECT * FROM subscription_packages WHERE id = ?';
        db.query(packageQuery, [package_id], (err, packageResults) => {
            if (err || packageResults.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy gói đăng ký' });
            }

            const package = packageResults[0];

            // Kiểm tra số dư người dùng
            const userQuery = 'SELECT balance FROM users WHERE id = ?';
            db.query(userQuery, [userId], (err, userResults) => {
                if (err || userResults.length === 0) {
                    return res.status(400).json({ message: 'Lỗi kiểm tra số dư' });
                }

                const userBalance = userResults[0].balance;
                if (userBalance < package.price) {
                    return res.status(400).json({ message: 'Số dư không đủ' });
                }

                // Tính ngày kết thúc
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + package.duration_days);

                // Tạo đăng ký mới
                const subscriptionQuery = `
                    INSERT INTO user_subscriptions (user_id, package_id, end_date, remaining_downloads)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(subscriptionQuery, [
                    userId,
                    package_id,
                    endDate,
                    package.download_limit
                ], (err, result) => {
                    if (err) {
                        return res.status(400).json({ message: 'Lỗi đăng ký gói', error: err.message });
                    }

                    // Trừ tiền và ghi nhận giao dịch
                    const transactionQuery = `
                        INSERT INTO transactions (user_id, type, amount, status, description)
                        VALUES (?, 'subscription', ?, 'completed', ?)
                    `;
                    db.query(transactionQuery, [
                        userId,
                        package.price,
                        `Đăng ký gói: ${package.name}`
                    ]);

                    // Cập nhật số dư
                    const updateBalanceQuery = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                    db.query(updateBalanceQuery, [package.price, userId]);

                    res.status(201).json({ message: 'Đăng ký gói thành công' });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy thông tin gói đăng ký hiện tại của người dùng
router.get('/current', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT us.*, sp.name as package_name, sp.download_limit
            FROM user_subscriptions us
            JOIN subscription_packages sp ON us.package_id = sp.id
            WHERE us.user_id = ? AND us.status = 'active' AND us.end_date > NOW()
        `;
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results[0] || null);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Hủy gói đăng ký
router.post('/cancel', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            UPDATE user_subscriptions 
            SET status = 'cancelled' 
            WHERE user_id = ? AND status = 'active'
        `;
        db.query(query, [userId], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi hủy gói', error: err.message });
            }
            res.json({ message: 'Hủy gói thành công' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router; 