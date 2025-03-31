const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/documents');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get all documents (admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const query = `
            SELECT d.*, c.name as category_name, u.username as uploader_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            LEFT JOIN users u ON d.uploader_id = u.id
            ORDER BY d.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Upload new document (admin only)
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, category_id, is_premium, price } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Please select a file to upload' });
        }

        const query = `
            INSERT INTO documents (
                title, description, file_path, file_size, file_type, 
                category_id, is_premium, price, uploader_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            title,
            description,
            file.path,
            file.size,
            file.mimetype,
            category_id || null,
            is_premium === 'true',
            price || null,
            req.user.id  // Add user ID who uploaded the document
        ], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading document', error: err.message });
            }
            res.status(201).json({ 
                message: 'Document uploaded successfully',
                document_id: result.insertId
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update document (admin only)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
    try {
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { id } = req.params;
        const { title, description, category_id, is_premium, price } = req.body;
        const file = req.file;

        console.log('Update document request:', {
            id,
            title,
            description,
            category_id,
            is_premium,
            price,
            hasFile: !!file
        });

        // Check if document exists
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }

            const document = results[0];
            let filePath = document.file_path;
            let fileSize = document.file_size;
            let fileType = document.file_type;

            // If there's a new file, update file info
            if (file) {
                // Delete old file if it exists
                if (fs.existsSync(document.file_path)) {
                    fs.unlinkSync(document.file_path);
                }
                filePath = file.path;
                fileSize = file.size;
                fileType = file.mimetype;
            }

            const query = `
                UPDATE documents 
                SET title = ?, description = ?, file_path = ?, file_size = ?, 
                    file_type = ?, category_id = ?, is_premium = ?, price = ?
                WHERE id = ?
            `;

            db.query(query, [
                title,
                description,
                filePath,
                fileSize,
                fileType,
                category_id || null,
                is_premium === 'true',
                price || null,
                id
            ], (err, result) => {
                if (err) {
                    console.error('Error updating document:', err);
                    return res.status(400).json({ message: 'Error updating document', error: err.message });
                }
                res.json({ message: 'Document updated successfully' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete document (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { id } = req.params;

        // Check if document exists
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }

            const document = results[0];

            // Delete file if it exists
            if (fs.existsSync(document.file_path)) {
                fs.unlinkSync(document.file_path);
            }

            // Delete from database
            db.query('DELETE FROM documents WHERE id = ?', [id], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: 'Error deleting document', error: err.message });
                }
                res.json({ message: 'Document deleted successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Preview document (admin only)
router.get('/:id/preview', auth, async (req, res) => {
    try {
        console.log('Accessed admin document preview route');
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { id } = req.params;
        
        db.query('SELECT * FROM documents WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database query error', error: err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            const document = results[0];
            const filePath = document.file_path;
            
            console.log('File path:', filePath);
            
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

// Download document
router.get('/download/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        db.query('SELECT file_path, file_type, title FROM documents WHERE id = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            const document = results[0];
            if (!fs.existsSync(document.file_path)) {
                return res.status(404).json({ message: 'File does not exist' });
            }
            
            // Update download count
            db.query('UPDATE documents SET download_count = download_count + 1 WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error updating download count:', err);
                }
            });
            
            // Return file for user to download
            const fileName = path.basename(document.file_path);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', document.file_type);
            
            const fileStream = fs.createReadStream(document.file_path);
            fileStream.pipe(res);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Debug endpoint to check file existence
router.get('/debug/file-exists', auth, async (req, res) => {
    try {
        // Check admin rights
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const { path: filePath } = req.query;
        
        if (!filePath) {
            return res.status(400).json({ message: 'No file path provided' });
        }
        
        const exists = fs.existsSync(filePath);
        
        res.json({
            path: filePath,
            exists,
            absolutePath: path.resolve(filePath),
            stats: exists ? fs.statSync(filePath) : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
