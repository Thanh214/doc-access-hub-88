require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: 'Z' // Đảm bảo timestamp được xử lý đúng
});

connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err);
        return;
    }
    console.log('Đã kết nối thành công với MySQL database');
});

module.exports = connection; 