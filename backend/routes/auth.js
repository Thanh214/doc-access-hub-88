
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, full_name], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi đăng ký', error: err.message });
            }
            res.status(201).json({ message: 'Đăng ký thành công' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy thông tin profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT id, username, email, full_name, role, balance, created_at 
            FROM users 
            WHERE id = ?
        `;
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
            }

            const user = results[0];
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                balance: user.balance,
                created_at: user.created_at
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Cập nhật thông tin profile
router.put('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, full_name } = req.body;

        const query = 'UPDATE users SET username = ?, full_name = ? WHERE id = ?';
        db.query(query, [username, full_name, userId], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
            }
            res.json({ message: 'Cập nhật thông tin thành công' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Đổi mật khẩu
router.put('/change-password', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;
        
        // Lấy mật khẩu hiện tại từ database
        const getUserQuery = 'SELECT password FROM users WHERE id = ?';
        db.query(getUserQuery, [userId], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
            }
            
            const user = results[0];
            
            // Kiểm tra mật khẩu hiện tại
            const isValidPassword = await bcrypt.compare(current_password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
            }
            
            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(new_password, 10);
            
            // Cập nhật mật khẩu mới
            const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
            db.query(updateQuery, [hashedPassword, userId], (updateErr, updateResult) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Lỗi cập nhật mật khẩu', error: updateErr.message });
                }
                
                res.json({ message: 'Đổi mật khẩu thành công' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router; 
