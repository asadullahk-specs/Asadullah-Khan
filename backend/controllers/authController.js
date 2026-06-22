const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

function signToken(admin) {
  return jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const admin = await Admin.findByEmail(String(email).trim().toLowerCase());
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken(admin);
  res.json({
    success: true,
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// POST /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required.');
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters.');
  }

  const admin = await Admin.findByEmail(req.admin.email);
  const match = await bcrypt.compare(currentPassword, admin.password);
  if (!match) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await Admin.updatePassword(admin.id, hash);
  res.json({ success: true, message: 'Password updated successfully.' });
});

module.exports = { login, getMe, changePassword };
