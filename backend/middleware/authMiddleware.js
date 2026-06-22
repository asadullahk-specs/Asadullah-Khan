const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Admin = require('../models/Admin');

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

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists.');
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
