require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Kiểm tra token trong header
        let token = req.header('Authorization');
        if (token) {
            token = token.replace('Bearer ', '');
        } 
        // Kiểm tra token trong cookie
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // Nếu không có token
        if (!token) {
            return res.status(401).json({ 
                message: 'Vui lòng đăng nhập để thực hiện thao tác này',
                error: 'NO_TOKEN'
            });
        }

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ 
            message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
            error: error.message 
        });
    }
}; 