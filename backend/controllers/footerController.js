const FooterSettings = require('../models/FooterSettings');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/footer (public)
const getFooter = asyncHandler(async (req, res) => {
  const footer = await FooterSettings.get();
  res.json({ success: true, data: footer });
});

// PUT /api/footer (admin)
const updateFooter = asyncHandler(async (req, res) => {
  const footer = await FooterSettings.update(req.body);
  res.json({ success: true, data: footer });
});

module.exports = { getFooter, updateFooter };
