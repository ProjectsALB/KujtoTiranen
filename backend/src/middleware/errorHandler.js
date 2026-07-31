const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    status = 400;
    message = 'Duplicate value';
  }
  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File too large (max 8MB)';
  }
  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
