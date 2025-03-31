
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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve documents directly for preview
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Expose the full file path for direct access (debugging)
app.get('/file-path/:filePath(*)', (req, res) => {
  const filePath = req.params.filePath;
  const fullPath = path.join(__dirname, filePath);
  
  console.log('Accessing file path:', fullPath);
  
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ message: 'File not found', path: fullPath });
  }
  
  res.sendFile(fullPath);
});

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
    console.log(`Server running on port ${PORT}`);
});
