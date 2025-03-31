const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads'));

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/documents';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Thêm timestamp vào tên file để tránh trùng lặp
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Lấy danh sách tài liệu
router.get('/', async (req, res) => {
    try {
        const { keyword, category_id, type } = req.query;
        
        let query = `
            SELECT 
                d.*,
                c.name as category_name,
                u.full_name as uploader_name,
                u.email as uploader_email
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            LEFT JOIN users u ON d.uploader_id = u.id
            WHERE 1=1
        `;
        
        const params = [];

        // Thêm điều kiện tìm kiếm
        if (keyword) {
            query += ` AND (d.title LIKE ? OR d.description LIKE ?)`;
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        if (category_id) {
            query += ` AND d.category_id = ?`;
            params.push(category_id);
        }

        // Lọc theo loại tài liệu
        if (type === 'free') {
            query += ` AND d.is_premium = false`;
        } else if (type === 'premium') {
            query += ` AND d.is_premium = true`;
        }

        // Chỉ lấy tài liệu active
        query += ` AND (d.status = 'active' OR d.status IS NULL)`;
        
        query += ` ORDER BY d.created_at DESC`;

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Lỗi query:', err);
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            
            // Format dữ liệu trước khi trả về
            const formattedResults = results.map(doc => ({
                id: doc.id,
                title: doc.title,
                description: doc.description,
                category: doc.category_name,
                price: doc.price ? Number(doc.price) : 0,
                file_path: doc.file_path,
                file_size: doc.file_size ? Number(doc.file_size) : 0,
                download_count: doc.download_count ? Number(doc.download_count) : 0,
                created_at: doc.created_at,
                is_premium: Boolean(doc.is_premium),
                uploader_name: doc.uploader_name || doc.uploader_email,
                status: doc.status || 'active'
            }));
            
            res.json(formattedResults);
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Upload tài liệu mới
router.post('/', auth, upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        console.log('User:', req.user);
        
        const { title, description, category_id, is_premium, price } = req.body;
        const files = req.files;
        const userId = req.user.id;

        if (!files || !files.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file tài liệu để upload' });
        }

        const file = files.file[0];
        const thumbnail = files.thumbnail ? files.thumbnail[0] : null;

        // Kiểm tra user có tồn tại không
        const userQuery = 'SELECT id FROM users WHERE id = ?';
        db.query(userQuery, [userId], (err, userResults) => {
            if (err || userResults.length === 0) {
                console.error('Lỗi kiểm tra user:', err);
                return res.status(400).json({ message: 'Không tìm thấy người dùng' });
            }

            const query = `
                INSERT INTO documents (
                    title, description, file_path, file_size, file_type, 
                    category_id, is_premium, price, uploader_id, thumbnail
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(query, [
                title,
                description,
                file.path.replace(/\\/g, '/'),
                file.size,
                file.mimetype,
                category_id || null,
                is_premium === 'true',
                price || null,
                userId,
                thumbnail ? thumbnail.path.replace(/\\/g, '/') : null
            ], (err, result) => {
                if (err) {
                    console.error('Lỗi khi insert:', err);
                    return res.status(400).json({ message: 'Lỗi upload tài liệu', error: err.message });
                }
                console.log('Upload thành công:', result);
                res.status(201).json({ 
                    message: 'Upload tài liệu thành công',
                    document_id: result.insertId
                });
            });
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Tải tài liệu
router.get('/download/:id', auth, async (req, res) => {
    try {
        const documentId = req.params.id;
        const userId = req.user.id;

        // Kiểm tra tài liệu có tồn tại không
        const docQuery = 'SELECT * FROM documents WHERE id = ?';
        db.query(docQuery, [documentId], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = results[0];
            const filePath = document.file_path.replace(/\\/g, '/');
            
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(document.file_path)) {
                console.error('File không tồn tại:', document.file_path);
                return res.status(404).json({ message: 'File không tồn tại trên server' });
            }

            // Kiểm tra nếu là tài liệu premium
            if (document.is_premium) {
                // Kiểm tra số dư người dùng
                const userQuery = 'SELECT balance FROM users WHERE id = ?';
                db.query(userQuery, [userId], (err, userResults) => {
                    if (err || userResults.length === 0) {
                        return res.status(400).json({ message: 'Lỗi kiểm tra số dư' });
                    }

                    const userBalance = userResults[0].balance;
                    if (userBalance < document.price) {
                        return res.status(400).json({ message: 'Số dư không đủ' });
                    }

                    // Trừ tiền và ghi nhận giao dịch
                    const transactionQuery = `
                        INSERT INTO transactions (user_id, type, amount, status, description)
                        VALUES (?, 'purchase', ?, 'completed', ?)
                    `;
                    db.query(transactionQuery, [
                        userId,
                        document.price,
                        `Mua tài liệu: ${document.title}`
                    ]);

                    // Cập nhật số dư
                    const updateBalanceQuery = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                    db.query(updateBalanceQuery, [document.price, userId]);

                    // Ghi nhận lịch sử tải
                    const downloadQuery = `
                        INSERT INTO download_history (user_id, document_id, is_premium, amount_paid)
                        VALUES (?, ?, true, ?)
                    `;
                    db.query(downloadQuery, [userId, documentId, document.price]);

                    // Tăng số lượt tải
                    const updateDownloadQuery = 'UPDATE documents SET download_count = download_count + 1 WHERE id = ?';
                    db.query(updateDownloadQuery, [documentId]);

                    // Trả về file cho client
                    res.download(document.file_path, path.basename(document.file_path));
                });
            } else {
                // Kiểm tra giới hạn tải của gói đăng ký
                const subscriptionQuery = `
                    SELECT us.*, sp.download_limit 
                    FROM user_subscriptions us
                    JOIN subscription_packages sp ON us.package_id = sp.id
                    WHERE us.user_id = ? AND us.status = 'active' AND us.end_date > NOW()
                `;
                db.query(subscriptionQuery, [userId], (err, subResults) => {
                    if (err) {
                        return res.status(400).json({ message: 'Lỗi kiểm tra gói đăng ký', error: err.message });
                    }
                    
                    if (subResults.length === 0) {
                        return res.status(400).json({ message: 'Bạn cần đăng ký gói để tải tài liệu' });
                    }

                    const subscription = subResults[0];
                    if (subscription.remaining_downloads <= 0) {
                        return res.status(400).json({ message: 'Bạn đã hết lượt tải trong gói hiện tại' });
                    }

                    // Cập nhật số lượt tải còn lại
                    const updateDownloadsQuery = `
                        UPDATE user_subscriptions 
                        SET remaining_downloads = remaining_downloads - 1 
                        WHERE id = ?
                    `;
                    db.query(updateDownloadsQuery, [subscription.id]);

                    // Ghi nhận lịch sử tải
                    const downloadQuery = `
                        INSERT INTO download_history (user_id, document_id, is_premium)
                        VALUES (?, ?, false)
                    `;
                    db.query(downloadQuery, [userId, documentId]);

                    // Tăng số lượt tải
                    const updateDownloadQuery = 'UPDATE documents SET download_count = download_count + 1 WHERE id = ?';
                    db.query(updateDownloadQuery, [documentId]);

                    // Trả về file cho client
                    res.download(document.file_path, path.basename(document.file_path));
                });
            }
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Chi tiết tài liệu
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                d.*,
                c.name as category_name,
                u.full_name as uploader_name,
                u.email as uploader_email
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            LEFT JOIN users u ON d.uploader_id = u.id
            WHERE d.id = ?
        `;
        db.query(query, [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = results[0];
            
            // Kiểm tra file có tồn tại không
            const filePath = document.file_path.replace(/\\/g, '/');
            if (!fs.existsSync(document.file_path)) {
                console.error('File không tồn tại:', document.file_path);
                return res.status(404).json({ message: 'File không tồn tại' });
            }

            // Format dữ liệu trước khi trả về
            const formattedDoc = {
                id: document.id,
                title: document.title,
                description: document.description,
                category_name: document.category_name || 'Chưa phân loại',
                price: document.price ? Number(document.price) : 0,
                file_path: filePath, // Đường dẫn đã được format
                file_size: document.file_size ? Number(document.file_size) : 0,
                file_type: document.file_type || 'Không xác định',
                download_count: document.download_count ? Number(document.download_count) : 0,
                created_at: document.created_at,
                is_premium: Boolean(document.is_premium),
                status: document.status || 'active',
                thumbnail: document.thumbnail ? document.thumbnail.replace(/\\/g, '/') : null,
                uploader_name: document.uploader_name || document.uploader_email || 'Admin',
                uploader_email: document.uploader_email
            };

            console.log('Document details:', formattedDoc);
            res.json(formattedDoc);
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// API lấy các tài liệu nổi bật (download nhiều nhất)
router.get('/featured/popular', async (req, res) => {
    try {
        const query = `
            SELECT d.*, c.name as category_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            ORDER BY d.download_count DESC
            LIMIT 8
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// API lấy các tài liệu mới nhất
router.get('/featured/latest', async (req, res) => {
    try {
        const query = `
            SELECT d.*, c.name as category_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            ORDER BY d.created_at DESC
            LIMIT 8
        `;
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xem trước tài liệu
router.get('/preview/:id', auth, async (req, res) => {
    try {
        const documentId = req.params.id;

        // Kiểm tra tài liệu có tồn tại không
        const docQuery = 'SELECT * FROM documents WHERE id = ?';
        db.query(docQuery, [documentId], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = results[0];
            const filePath = document.file_path.replace(/\\/g, '/');
            
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(document.file_path)) {
                console.error('File không tồn tại:', document.file_path);
                return res.status(404).json({ message: 'File không tồn tại trên server' });
            }

            // Xử lý theo loại file
            const fileType = document.file_type.toLowerCase();
            
            if (fileType.includes('pdf')) {
                // PDF files
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${path.basename(document.file_path)}"`);
                fs.createReadStream(document.file_path).pipe(res);
            } 
            else if (fileType.includes('image')) {
                // Image files
                res.setHeader('Content-Type', document.file_type);
                res.setHeader('Content-Disposition', `inline; filename="${path.basename(document.file_path)}"`);
                fs.createReadStream(document.file_path).pipe(res);
            }
            else if (fileType.includes('text') || fileType.includes('rtf') || fileType.includes('msword')) {
                // Text files
                fs.readFile(document.file_path, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Lỗi đọc file:', err);
                        return res.status(500).json({ message: 'Lỗi đọc file' });
                    }
                    res.setHeader('Content-Type', 'text/plain');
                    res.send(data);
                });
            }
            else {
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
