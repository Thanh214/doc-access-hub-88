
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Lấy thông tin người dùng hiện tại
router.get('/me', verifyToken, userController.getCurrentUser);

// Cập nhật thông tin người dùng
router.put('/update', verifyToken, userController.updateUser);

// Đổi mật khẩu
router.put('/change-password', verifyToken, userController.changePassword);

module.exports = router;
