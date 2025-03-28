
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [users] = await pool.query(
      'SELECT id, name, email, avatar, balance, created_at FROM users WHERE id = ?',
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
    const { name, email } = req.body;
    
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
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, emailToUpdate, userId]
    );
    
    res.status(200).json({ 
      message: 'Cập nhật thông tin thành công',
      user: {
        id: userId,
        name,
        email: emailToUpdate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật avatar người dùng
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file ảnh được tải lên' });
    }
    
    // Đường dẫn đến file avatar mới
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Lấy avatar cũ để xóa nếu có
    const [currentUser] = await pool.query(
      'SELECT avatar FROM users WHERE id = ?',
      [userId]
    );
    
    // Cập nhật avatar mới vào database
    await pool.query(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatarPath, userId]
    );
    
    // Xóa file ảnh cũ nếu tồn tại
    const oldAvatar = currentUser[0]?.avatar;
    if (oldAvatar && oldAvatar !== '/uploads/avatars/default.png') {
      const oldAvatarPath = path.join(__dirname, '..', 'public', oldAvatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    res.status(200).json({ 
      message: 'Cập nhật avatar thành công',
      avatar: avatarPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy số dư tài khoản
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [result] = await pool.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({ balance: result[0].balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Nạp tiền vào tài khoản
exports.addBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền nạp không hợp lệ' });
    }
    
    // Lấy số dư hiện tại
    const [currentBalance] = await pool.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (currentBalance.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    const newBalance = parseFloat(currentBalance[0].balance) + parseFloat(amount);
    
    // Cập nhật số dư mới
    await pool.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [newBalance, userId]
    );
    
    res.status(200).json({ 
      message: 'Nạp tiền thành công',
      balance: newBalance
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
