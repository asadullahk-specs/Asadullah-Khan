const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { pool } = require('../config/db');

// Protects admin-only routes. Expects: Authorization: Bearer <token>
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Session expired or invalid token. Please log in again.');
  }

  const [rows] = await pool.query('SELECT id, name, email FROM admins WHERE id = ? LIMIT 1', [decoded.id]);
  if (!rows.length) {
    throw new ApiError(401, 'Admin account no longer exists.');
  }

  req.admin = rows[0];
  next();
});

module.exports = { protect };
