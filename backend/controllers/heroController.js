const Hero = require('../models/Hero');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/hero (public)
const getHero = asyncHandler(async (req, res) => {
  const hero = await Hero.get();
  res.json({ success: true, data: hero });
});

// PUT /api/hero (admin)
const updateHero = asyncHandler(async (req, res) => {
  const hero = await Hero.update(req.body);
  res.json({ success: true, data: hero });
});

module.exports = { getHero, updateHero };
