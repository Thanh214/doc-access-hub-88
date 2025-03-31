
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const path = require('path');
const fs = require('fs');

// Admin dashboard stats
router.get('/stats', verifyToken, adminController.getStats);

// Get all users
router.get('/users', verifyToken, adminController.getUsers);

// Get all documents
router.get('/documents', verifyToken, adminController.getDocuments);

// Get all transactions
router.get('/transactions', verifyToken, adminController.getTransactions);

// Get transaction summary
router.get('/transaction-summary', verifyToken, adminController.getTransactionSummary);

// Preview document
router.get('/documents/:id/preview', verifyToken, (req, res) => {
  const documentId = req.params.id;
  
  try {
    // Gọi controller để lấy thông tin về tài liệu
    const db = require('../config/database');
    
    // Tìm tài liệu theo ID
    db.query('SELECT * FROM documents WHERE id = ?', [documentId], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn database:', err);
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
      }
      
      const document = results[0];
      const filePath = document.file_path;
      
      // Kiểm tra file có tồn tại không
      if (!fs.existsSync(filePath)) {
        console.error('File không tồn tại:', filePath);
        return res.status(404).json({ message: 'File không tồn tại' });
      }
      
      // Xác định loại file và xử lý phù hợp
      const fileType = document.file_type.toLowerCase();
      
      if (fileType.includes('pdf')) {
        // PDF files
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        fs.createReadStream(filePath).pipe(res);
      } 
      else if (fileType.includes('image')) {
        // Image files
        res.setHeader('Content-Type', document.file_type);
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        fs.createReadStream(filePath).pipe(res);
      }
      else if (fileType.includes('text') || fileType.includes('rtf') || fileType.includes('msword')) {
        // Text files
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).json({ message: 'Lỗi đọc file' });
          }
          res.setHeader('Content-Type', 'text/plain');
          res.send(data);
        });
      } else {
        // Các loại file khác - trả về thông báo không hỗ trợ xem trước
        res.status(400).json({ 
          message: 'Không hỗ trợ xem trước loại file này',
          fileType: document.file_type
        });
      }
    });
    
  } catch (error) {
    console.error('Lỗi server:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
