const multer = require('multer');

// 404 handler — runs if no route matched.
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler — every thrown error (sync or async, via asyncHandler)
// ends up here instead of leaking a stack trace to the client.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Multer-specific errors (file too large, wrong field, etc.)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large.'
        : `Upload error: ${err.message}`;
  }

  // MySQL duplicate entry (e.g. unique email already exists)
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this value already exists.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
