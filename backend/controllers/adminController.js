
const pool = require('../config/db');

// Get admin dashboard stats
exports.getStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    // Get total users
    const [usersResult] = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult[0].count;

    // Get total documents
    const [documentsResult] = await pool.query('SELECT COUNT(*) as count FROM documents');
    const totalDocuments = documentsResult[0].count;

    // Get total revenue
    const [revenueResult] = await pool.query(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'purchase' AND status = 'completed'"
    );
    const totalRevenue = revenueResult[0].total || 0;

    // Get active subscriptions
    const [subscriptionsResult] = await pool.query(
      "SELECT COUNT(*) as count FROM user_subscriptions WHERE status = 'active' AND end_date > NOW()"
    );
    const activeSubscriptions = subscriptionsResult[0].count;

    // Get deposit summary
    const [depositResult] = await pool.query(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'deposit' AND status = 'completed'"
    );
    const totalDeposits = depositResult[0].total || 0;

    // Get purchase summary
    const [purchaseResult] = await pool.query(
      "SELECT SUM(amount) as total FROM transactions WHERE type = 'purchase' AND status = 'completed'"
    );
    const totalPurchases = purchaseResult[0].total || 0;

    // Get document download count
    const [downloadResult] = await pool.query(
      "SELECT SUM(download_count) as total FROM documents"
    );
    const totalDownloads = downloadResult[0].total || 0;

    res.status(200).json({
      totalUsers,
      totalDocuments,
      totalDeposits,
      totalPurchases,
      totalRevenue,
      activeSubscriptions,
      totalDownloads
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const [users] = await pool.query(
      'SELECT id, full_name, email, role, balance, created_at FROM users ORDER BY id DESC'
    );

    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const [documents] = await pool.query(
      'SELECT id, title, description, is_premium, price, download_count, created_at FROM documents ORDER BY id DESC'
    );

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const [transactions] = await pool.query(
      'SELECT id, user_id, type, amount, status, description, created_at FROM transactions ORDER BY created_at DESC'
    );

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get transaction summary
exports.getTransactionSummary = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    // Get summary by transaction type
    const [typeSummary] = await pool.query(
      `SELECT 
        type, 
        COUNT(*) as count, 
        SUM(amount) as total 
      FROM transactions 
      WHERE status = 'completed' 
      GROUP BY type`
    );

    // Get summary by day (last 7 days)
    const [dailySummary] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        type,
        COUNT(*) as count, 
        SUM(amount) as total 
      FROM transactions 
      WHERE status = 'completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at), type
      ORDER BY date DESC`
    );

    res.status(200).json({
      typeSummary,
      dailySummary
    });
  } catch (error) {
    console.error('Error getting transaction summary:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
