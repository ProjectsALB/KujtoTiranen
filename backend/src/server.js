const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const connectDB = require('./config/db');
const { ensureLocalDir, driverInfo } = require('./utils/storage');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Project root = Kujto-Tirane-Pro/  (two levels up from src/)
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const INDEX_HTML = path.join(PROJECT_ROOT, 'index.html');
const ADMIN_HTML = path.join(PROJECT_ROOT, 'admin.html');

console.log('PROJECT_ROOT:', PROJECT_ROOT);
console.log('INDEX exists:', fs.existsSync(INDEX_HTML));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Uploaded photos
ensureLocalDir();
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// API routes FIRST
app.use('/api/v1/photos', require('./routes/photos'));
app.use('/api/v1/contact', require('./routes/contact'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/comments', require('./routes/comments'));

app.get('/api/v1/health', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    success: true,
    message: 'Kujto Tiranën API is running',
    version: '1.6.0',
    service: 'kujto-tiranen-api',
    time: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime()),
    node: process.version,
    memory: {
      rssMB: Math.round(mem.rss / 1048576),
      heapUsedMB: Math.round(mem.heapUsed / 1048576),
    },
    storage: process.env.STORAGE_DRIVER || 'local',
  });
});

// Frontend static files (css, js, images, fotot)
app.use(express.static(PROJECT_ROOT));

// Explicit pages
app.get('/', (_req, res) => {
  if (!fs.existsSync(INDEX_HTML)) {
    return res.status(404).send(
      'index.html not found at: ' + INDEX_HTML +
      '<br>Make sure you run npm start from the backend folder inside Kujto-Tirane-Pro.'
    );
  }
  res.sendFile(INDEX_HTML);
});

app.get('/admin', (_req, res) => {
  if (!fs.existsSync(ADMIN_HTML)) {
    return res.status(404).send('admin.html not found');
  }
  res.sendFile(ADMIN_HTML);
});

app.get('/admin.html', (_req, res) => res.sendFile(ADMIN_HTML));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// JWT_SECRET check — missing secret causes login/register 500
if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 8) {
  console.error('');
  console.error('ERROR: JWT_SECRET is missing. Copy backend/.env.example to backend/.env');
  console.error('  cd backend && cp .env.example .env');
  console.error('');
}


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('  Kujto Tiranën server is running');
      console.log('  Faqja:  http://localhost:' + PORT);
      console.log('  Admin:  http://localhost:' + PORT + '/admin');
      console.log('  API:    http://localhost:' + PORT + '/api/v1/health');
      console.log('========================================');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('MongoDB error:', err.message);
    console.error('Start MongoDB or set MONGODB_URI in backend/.env');
    process.exit(1);
  });
