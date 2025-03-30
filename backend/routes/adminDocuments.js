
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadDir = 'uploads/documents';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Get all documents (admin)
router.get('/', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  try {
    const query = `
      SELECT d.*, c.name as category_name 
      FROM documents d 
      LEFT JOIN categories c ON d.category_id = c.id
      ORDER BY d.id DESC
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching documents:', err);
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Add new document (admin)
router.post('/', auth, upload.single('file'), async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  try {
    const { title, description, category_id, is_premium, price } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được tải lên' });
    }

    const isPremium = is_premium === 'true';
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const fileType = req.file.mimetype;

    const query = `
      INSERT INTO documents (
        title, description, file_path, file_size, file_type, 
        category_id, is_premium, price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title,
      description,
      filePath,
      fileSize,
      fileType,
      category_id || null,
      isPremium,
      isPremium ? price : null
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Error adding document:', err);
        return res.status(500).json({ message: 'Lỗi thêm tài liệu', error: err.message });
      }
      
      res.status(201).json({ 
        message: 'Thêm tài liệu thành công',
        document_id: result.insertId
      });
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Delete document (admin)
router.delete('/:id', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  try {
    const documentId = req.params.id;

    // First, get the document to find the file path
    db.query('SELECT file_path FROM documents WHERE id = ?', [documentId], (err, results) => {
      if (err) {
        console.error('Error fetching document:', err);
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
      }

      const filePath = results[0].file_path;

      // Delete the document from the database
      db.query('DELETE FROM documents WHERE id = ?', [documentId], (err, result) => {
        if (err) {
          console.error('Error deleting document:', err);
          return res.status(500).json({ message: 'Lỗi xóa tài liệu', error: err.message });
        }

        // Try to delete the file from disk
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileErr) {
          console.error('Error deleting file:', fileErr);
          // Continue even if file deletion fails
        }

        res.json({ message: 'Xóa tài liệu thành công' });
      });
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Update document (admin)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  try {
    const documentId = req.params.id;
    const { title, description, category_id, is_premium, price } = req.body;
    const isPremium = is_premium === 'true';

    let updateFields = [];
    let updateParams = [];

    // Add fields to update
    if (title) {
      updateFields.push('title = ?');
      updateParams.push(title);
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(description);
    }
    
    if (category_id) {
      updateFields.push('category_id = ?');
      updateParams.push(category_id);
    }
    
    if (is_premium !== undefined) {
      updateFields.push('is_premium = ?');
      updateParams.push(isPremium);
    }
    
    if (price !== undefined && isPremium) {
      updateFields.push('price = ?');
      updateParams.push(price);
    } else if (isPremium === false) {
      updateFields.push('price = NULL');
    }

    // Handle file update
    if (req.file) {
      // Get the old file path first
      db.query('SELECT file_path FROM documents WHERE id = ?', [documentId], (err, results) => {
        if (err) {
          console.error('Error fetching document:', err);
          return res.status(500).json({ message: 'Lỗi server', error: err.message });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const oldFilePath = results[0].file_path;

        // Update file information
        updateFields.push('file_path = ?, file_size = ?, file_type = ?');
        updateParams.push(req.file.path, req.file.size, req.file.mimetype);

        // Complete the update query
        updateParams.push(documentId);
        const updateQuery = `
          UPDATE documents 
          SET ${updateFields.join(', ')}, updated_at = NOW()
          WHERE id = ?
        `;

        db.query(updateQuery, updateParams, (err, result) => {
          if (err) {
            console.error('Error updating document:', err);
            return res.status(500).json({ message: 'Lỗi cập nhật tài liệu', error: err.message });
          }

          // Try to delete the old file
          try {
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (fileErr) {
            console.error('Error deleting old file:', fileErr);
            // Continue even if file deletion fails
          }

          res.json({ message: 'Cập nhật tài liệu thành công' });
        });
      });
    } else {
      // No file update, just update other fields
      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'Không có thông tin để cập nhật' });
      }

      updateParams.push(documentId);
      const updateQuery = `
        UPDATE documents 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = ?
      `;

      db.query(updateQuery, updateParams, (err, result) => {
        if (err) {
          console.error('Error updating document:', err);
          return res.status(500).json({ message: 'Lỗi cập nhật tài liệu', error: err.message });
        }

        res.json({ message: 'Cập nhật tài liệu thành công' });
      });
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
