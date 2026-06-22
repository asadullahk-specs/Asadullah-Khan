const ContactSettings = require('../models/ContactSettings');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/contact-settings (public)
const getContactSettings = asyncHandler(async (req, res) => {
  const settings = await ContactSettings.get();
  res.json({ success: true, data: settings });
});

// PUT /api/contact-settings (admin)
const updateContactSettings = asyncHandler(async (req, res) => {
  const settings = await ContactSettings.update(req.body);
  res.json({ success: true, data: settings });
});

module.exports = { getContactSettings, updateContactSettings };
