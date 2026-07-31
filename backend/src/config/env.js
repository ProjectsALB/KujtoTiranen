/**
 * Central env loader — avoids scattered process.env hardcoding.
 */
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
} catch (_) {
  // dotenv optional in minimal test environments
}

function required(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === '') {
    if (fallback !== undefined) return fallback;
    return '';
  }
  return v;
}

const env = {
  nodeEnv: required('NODE_ENV', 'development'),
  port: Number(required('PORT', '5000')),
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/kujto-tiranen'),
  jwtSecret: required('JWT_SECRET', ''),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '7d'),
  frontendUrl: required('FRONTEND_URL', 'http://localhost:5000'),
  contactTo: required('CONTACT_TO_EMAIL', 'admin@example.com'),
  adminEmail: required('ADMIN_EMAIL', 'admin@kujtotiranen.al'),
  adminPassword: required('ADMIN_PASSWORD', 'Admin123!'),
  googleClientId: required('GOOGLE_CLIENT_ID', ''),
  uploadDir: required('UPLOAD_DIR', path.resolve(__dirname, '../../uploads')),
  storageDriver: required('STORAGE_DRIVER', 'local'),
  s3Bucket: required('S3_BUCKET', ''),
  s3Region: required('S3_REGION', ''),
  isProd: required('NODE_ENV', 'development') === 'production',
};

function assertJwt() {
  if (!env.jwtSecret || env.jwtSecret.length < 8) {
    const err = new Error(
      'JWT_SECRET missing or too short. Copy backend/.env.example → backend/.env'
    );
    err.statusCode = 500;
    throw err;
  }
}

module.exports = { env, assertJwt };
