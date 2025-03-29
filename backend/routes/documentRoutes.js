
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|txt|ppt|pptx|xls|xlsx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file định dạng: pdf, doc, docx, txt, ppt, pptx, xls, xlsx'));
  }
});

// Route công khai
router.get('/', documentController.getAllDocuments);
router.get('/featured', documentController.getFeaturedDocuments);
router.get('/category/:category', documentController.getDocumentsByCategory);
router.get('/:id', documentController.getDocumentById);

// Route yêu cầu xác thực
router.post('/', verifyToken, upload.single('document'), documentController.uploadDocument);
router.put('/:id', verifyToken, upload.single('document'), documentController.updateDocument);
router.delete('/:id', verifyToken, documentController.deleteDocument);

// Lấy tài liệu của người dùng hiện tại
router.get('/user/documents', verifyToken, documentController.getUserDocuments);

module.exports = router;
