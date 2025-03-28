
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình lưu trữ file avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg'; // Sử dụng .jpg nếu không có phần mở rộng
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

// Chấp nhận tất cả các định dạng file ảnh
const fileFilter = (req, file, cb) => {
  // Chấp nhận tất cả các file với mime type bắt đầu bằng 'image/'
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Tăng giới hạn file lên 10MB
});

// Lấy thông tin người dùng hiện tại
router.get('/me', verifyToken, userController.getCurrentUser);

// Cập nhật thông tin người dùng
router.put('/update', verifyToken, userController.updateUser);

// Cập nhật avatar
router.post('/update-avatar', verifyToken, upload.single('avatar'), userController.updateAvatar);

// Lấy số dư tài khoản
router.get('/balance', verifyToken, userController.getBalance);

// Nạp tiền vào tài khoản
router.post('/add-balance', verifyToken, userController.addBalance);

// Đổi mật khẩu
router.put('/change-password', verifyToken, userController.changePassword);

module.exports = router;
