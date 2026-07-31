/**
 * Upload storage abstraction.
 * Default: local disk under UPLOAD_DIR.
 * STORAGE_DRIVER=s3 is reserved for production object storage (configure later).
 */
const fs = require('fs');
const path = require('path');
const { env } = require('../config/env');

function ensureLocalDir() {
  if (!fs.existsSync(env.uploadDir)) {
    fs.mkdirSync(env.uploadDir, { recursive: true });
  }
  return env.uploadDir;
}

function publicUrlFor(filename) {
  if (env.storageDriver === 's3' && env.s3Bucket) {
    // Placeholder for CDN/S3 public URL pattern
    return `https://${env.s3Bucket}.s3.${env.s3Region || 'eu-central-1'}.amazonaws.com/${filename}`;
  }
  return `/uploads/${filename}`;
}

function driverInfo() {
  return {
    driver: env.storageDriver,
    uploadDir: env.storageDriver === 'local' ? env.uploadDir : undefined,
    s3Bucket: env.storageDriver === 's3' ? env.s3Bucket : undefined,
  };
}

module.exports = { ensureLocalDir, publicUrlFor, driverInfo };
