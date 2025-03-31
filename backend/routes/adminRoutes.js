
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

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

// Preview document (thêm mới)
router.get('/documents/:id/preview', verifyToken, adminController.previewDocument);

module.exports = router;
