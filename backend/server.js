const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const path = require('path');
const fs = require('fs');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const documentsDir = path.join(uploadsDir, 'documents');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.1.224:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files với cấu hình CORS
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/documents', require('./routes/adminDocuments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
