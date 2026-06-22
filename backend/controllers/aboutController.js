const AboutPage = require('../models/AboutPage');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/about (public)
const getAbout = asyncHandler(async (req, res) => {
  const about = await AboutPage.get();
  res.json({ success: true, data: about });
});

// PUT /api/about (admin)
const updateAbout = asyncHandler(async (req, res) => {
  const about = await AboutPage.update(req.body);
  res.json({ success: true, data: about });
});

module.exports = { getAbout, updateAbout };
