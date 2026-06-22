const SiteSettings = require('../models/SiteSettings');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/settings (admin)
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.get();
  res.json({ success: true, data: settings });
});

// PUT /api/settings (admin)
const updateSettings = asyncHandler(async (req, res) => {
  const { siteName, siteTagline, seoDescription, favicon, adminEmail } = req.body;
  const settings = await SiteSettings.update({ siteName, siteTagline, seoDescription, favicon, adminEmail });
  res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
