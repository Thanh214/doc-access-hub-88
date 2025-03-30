const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Cấu hình multer cho upload file và ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = 'uploads/documents';
        // Nếu là thumbnail thì lưu vào thư mục thumbnails
        if (file.fieldname === 'thumbnail') {
            dir = 'uploads/thumbnails';
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Lấy phần mở rộng của file gốc
        const ext = path.extname(file.originalname);
        // Tạo tên file mới với timestamp
        cb(null, Date.now() + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
        // Cho phép các định dạng ảnh
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)'), false);
        }
    } else {
        // Cho phép các định dạng tài liệu
        const allowedDocTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX, XLS, XLSX'), false);
        }
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
    }
});

// Lấy danh sách tài liệu
router.get('/', async (req, res) => {
    try {
        const { keyword, category_id, type } = req.query;
        
        let query = `
            SELECT 
                d.id,
                d.title,
                d.description,
                d.file_path,
                d.file_size,
                d.file_type,
                d.is_premium,
                d.price,
                d.download_count,
                d.created_at,
                d.status,
                d.thumbnail,
                c.name as category_name,
                u.full_name as uploader_name,
                u.email as uploader_email
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            LEFT JOIN users u ON d.uploader_id = u.id
            WHERE (d.status = 'active' OR d.status IS NULL)
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
        
        query += ` ORDER BY d.created_at DESC`;

        console.log('Executing query:', query);
        console.log('With params:', params);

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Lỗi server', 
                    error: err.message,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState 
                });
            }
            
            // Format dữ liệu trước khi trả về
            const formattedResults = results.map(doc => ({
                id: doc.id,
                title: doc.title,
                description: doc.description,
                category_name: doc.category_name || 'Chưa phân loại',
                price: doc.price ? Number(doc.price) : 0,
                file_path: doc.file_path,
                file_size: doc.file_size ? Number(doc.file_size) : 0,
                file_type: doc.file_type || 'Không xác định',
                download_count: doc.download_count ? Number(doc.download_count) : 0,
                created_at: doc.created_at,
                is_premium: Boolean(doc.is_premium),
                status: doc.status || 'active',
                thumbnail: doc.thumbnail || null,
                uploader_name: doc.uploader_name || doc.uploader_email || 'Admin',
                uploader_email: doc.uploader_email
            }));
            
            // Log để debug
            console.log('Formatted documents:', JSON.stringify(formattedResults, null, 2));
            
            console.log(`Found ${formattedResults.length} documents`);
            res.json(formattedResults);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            message: 'Lỗi server', 
            error: error.message 
        });
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
        
        const { title, description, category_id, is_premium, price } = req.body;
        const files = req.files;
        const userId = req.user.id;

        if (!files || !files.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file tài liệu để upload' });
        }

        const file = files.file[0];
        const thumbnail = files.thumbnail ? files.thumbnail[0] : null;

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
            file.path.replace(/\\/g, '/'), // Chuyển đổi dấu \ thành / cho đường dẫn file
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
            res.status(201).json({ 
                message: 'Upload tài liệu thành công',
                document_id: result.insertId
            });
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xem trước tài liệu
router.get('/:id/preview', async (req, res) => {
    try {
        const documentId = req.params.id;
        
        // Trả về một đoạn HTML preview giả lập
        // Trong ứng dụng thực tế, bạn có thể tạo preview từ file PDF hoặc trả về đường dẫn tới file preview
        const previewHtml = `
            <h1 class="text-2xl font-bold mb-4">Đây là phần xem trước tài liệu</h1>
            <p class="mb-3">Đây là nội dung xem trước của tài liệu. Trong môi trường thực tế, bạn sẽ cần một dịch vụ chuyển đổi tài liệu để tạo ra phần xem trước này.</p>
            <p class="mb-3">Các định dạng tài liệu phổ biến như PDF, DOCX, PPTX sẽ cần công cụ chuyên biệt để tạo preview HTML.</p>
            <div class="border p-4 rounded-md bg-gray-50 my-4">
                <h2 class="text-xl font-semibold mb-2">Ví dụ về nội dung tài liệu</h2>
                <p>Đây là một đoạn văn bản mẫu từ tài liệu. Nội dung đầy đủ sẽ được hiển thị khi bạn mua hoặc tải tài liệu về.</p>
            </div>
            <div class="my-4">
                <h3 class="text-lg font-semibold">Một số điểm chính trong tài liệu:</h3>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Điểm quan trọng thứ nhất</li>
                    <li>Điểm quan trọng thứ hai</li>
                    <li>Điểm quan trọng thứ ba</li>
                    <li>Kết luận và đề xuất</li>
                </ul>
            </div>
        `;
        
        res.json({ 
            preview: previewHtml,
            pages: Math.floor(Math.random() * 20) + 5 // Số trang giả lập
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Kiểm tra xem người dùng có đủ điều kiện để tải tài liệu không
router.get('/:id/check-eligibility', auth, async (req, res) => {
    try {
        const documentId = req.params.id;
        const userId = req.user.id;

        // Lấy thông tin tài liệu
        const docQuery = 'SELECT * FROM documents WHERE id = ?';
        db.query(docQuery, [documentId], (err, docResults) => {
            if (err || docResults.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }

            const document = docResults[0];
            
            // Nếu tài liệu premium, kiểm tra số dư
            if (document.is_premium) {
                const userQuery = 'SELECT balance FROM users WHERE id = ?';
                db.query(userQuery, [userId], (err, userResults) => {
                    if (err || userResults.length === 0) {
                        return res.status(400).json({ message: 'Lỗi kiểm tra số dư' });
                    }

                    const userBalance = userResults[0].balance;
                    
                    res.json({
                        eligible: userBalance >= document.price,
                        reason: userBalance >= document.price ? null : 'insufficient_balance',
                        requiredBalance: document.price,
                        currentBalance: userBalance
                    });
                });
            } else {
                // Kiểm tra gói đăng ký cho tài liệu miễn phí
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
                        return res.json({
                            eligible: false,
                            reason: 'no_subscription',
                            message: 'Bạn cần đăng ký gói để tải tài liệu miễn phí'
                        });
                    }

                    const subscription = subResults[0];
                    
                    res.json({
                        eligible: subscription.remaining_downloads > 0,
                        reason: subscription.remaining_downloads > 0 ? null : 'download_limit_reached',
                        subscription: {
                            package_name: subscription.package_name,
                            remaining_downloads: subscription.remaining_downloads,
                            end_date: subscription.end_date
                        }
                    });
                });
            }
        });
    } catch (error) {
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
            
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(document.file_path)) {
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
                    SELECT us.*, sp.download_limit, sp.name as package_name
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
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Chi tiết tài liệu
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT d.*, c.name as category_name 
            FROM documents d 
            LEFT JOIN categories c ON d.category_id = c.id
            WHERE d.id = ?
        `;
        db.query(query, [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
            }
            res.json(results[0]);
        });
    } catch (error) {
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

// Thêm route mới để lấy tất cả danh mục
router.get('/categories', async (req, res) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Lỗi query:', err);
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
