
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [users] = await pool.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;
    
    // Kiểm tra email đã tồn tại chưa (nếu email thay đổi)
    if (email) {
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email đã được sử dụng bởi người dùng khác' });
      }
    }
    
    // Lấy thông tin người dùng hiện tại để giữ email nếu không cung cấp
    const [currentUser] = await pool.query(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );
    
    const currentEmail = currentUser[0]?.email || '';
    const emailToUpdate = email || currentEmail;
    
    // Cập nhật thông tin người dùng
    await pool.query(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [full_name, emailToUpdate, userId]
    );
    
    res.status(200).json({ 
      message: 'Cập nhật thông tin thành công',
      user: {
        id: userId,
        full_name,
        email: emailToUpdate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Kiểm tra mật khẩu hiện tại
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật mật khẩu
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
