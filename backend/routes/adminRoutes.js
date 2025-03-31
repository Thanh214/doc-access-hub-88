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
  console.log('Accessed preview document route in adminRoutes.js');
  const documentId = req.params.id;
  
  try {
    // Get document information from database
    const db = require('../config/database');
    
    // Find document by ID
    db.query('SELECT * FROM documents WHERE id = ?', [documentId], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      const document = results[0];
      const filePath = document.file_path;
      
      console.log('File path in adminRoutes:', filePath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error('File does not exist:', filePath);
        return res.status(404).json({ message: 'File does not exist', path: filePath });
      }
      
      // Determine file type and handle accordingly
      const fileType = document.file_type ? document.file_type.toLowerCase() : '';
      console.log('File type:', fileType);
      
      // For PDFs
      if (fileType.includes('pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        fs.createReadStream(filePath).pipe(res);
      } 
      // For images
      else if (fileType.includes('image')) {
        res.setHeader('Content-Type', document.file_type);
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        fs.createReadStream(filePath).pipe(res);
      }
      // For text files
      else if (fileType.includes('text') || fileType.includes('rtf') || fileType.includes('msword')) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
          }
          res.setHeader('Content-Type', 'text/plain');
          res.send(data);
        });
      } 
      // For MS Office documents (PowerPoint, Word, Excel)
      else if (fileType.includes('officedocument') || fileType.includes('pptx') || fileType.includes('docx') || fileType.includes('xlsx')) {
        // For Office documents, just send the file directly
        res.download(filePath, path.basename(filePath), (err) => {
          if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ message: 'Error sending file', error: err.message });
          }
        });
      }
      else {
        // Other file types - return the file directly
        res.sendFile(path.resolve(filePath), (err) => {
          if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ message: 'Error sending file', error: err.message });
          }
        });
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
