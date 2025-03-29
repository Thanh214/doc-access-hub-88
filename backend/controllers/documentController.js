
const pool = require('../config/db');

// Lấy tất cả tài liệu
exports.getAllDocuments = async (req, res) => {
  try {
    const [documents] = await pool.query(`
      SELECT d.*, c.name as category, u.name as author
      FROM documents d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tài liệu theo ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [documents] = await pool.query(`
      SELECT d.*, c.name as category, u.name as author
      FROM documents d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [id]);
    
    if (documents.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    res.status(200).json(documents[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tài liệu nổi bật
exports.getFeaturedDocuments = async (req, res) => {
  try {
    const [documents] = await pool.query(`
      SELECT d.*, c.name as category, u.name as author
      FROM documents d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.is_featured = true
      ORDER BY d.created_at DESC
      LIMIT 6
    `);
    
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tài liệu theo danh mục
exports.getDocumentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const [documents] = await pool.query(`
      SELECT d.*, c.name as category, u.name as author
      FROM documents d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE c.name = ?
      ORDER BY d.created_at DESC
    `, [category]);
    
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tài liệu của người dùng
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy cả tài liệu đã tạo và đã mua
    const [documents] = await pool.query(`
      (SELECT d.*, c.name as category, 'owned' as type
       FROM documents d
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.user_id = ?)
      UNION
      (SELECT d.*, c.name as category, 'purchased' as type
       FROM documents d
       LEFT JOIN categories c ON d.category_id = c.id
       LEFT JOIN purchases p ON d.id = p.document_id
       WHERE p.user_id = ?)
      ORDER BY created_at DESC
    `, [userId, userId]);
    
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tải lên tài liệu mới
exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, price, categoryId, content } = req.body;
    const userId = req.user.id;
    const thumbnail = req.file ? req.file.filename : null;
    
    const isFree = price === 0;
    
    const [result] = await pool.query(
      'INSERT INTO documents (title, description, price, is_free, category_id, user_id, thumbnail, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, isFree, categoryId, userId, thumbnail, content]
    );
    
    res.status(201).json({ 
      message: 'Tài liệu đã được tải lên thành công',
      documentId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật tài liệu
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId, content } = req.body;
    const userId = req.user.id;
    const thumbnail = req.file ? req.file.filename : null;
    
    // Kiểm tra quyền sở hữu
    const [documents] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (documents.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    if (documents[0].user_id !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật tài liệu này' });
    }
    
    const isFree = price === 0;
    
    let query = 'UPDATE documents SET title = ?, description = ?, price = ?, is_free = ?, category_id = ?, content = ?';
    let params = [title, description, price, isFree, categoryId, content];
    
    if (thumbnail) {
      query += ', thumbnail = ?';
      params.push(thumbnail);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await pool.query(query, params);
    
    res.status(200).json({ message: 'Tài liệu đã được cập nhật thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa tài liệu
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Kiểm tra quyền sở hữu
    const [documents] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (documents.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    
    if (documents[0].user_id !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa tài liệu này' });
    }
    
    await pool.query('DELETE FROM documents WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Tài liệu đã được xóa thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
