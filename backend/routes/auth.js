const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

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
                { id: user.id, email: user.email },
                'your_jwt_secret',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router; 