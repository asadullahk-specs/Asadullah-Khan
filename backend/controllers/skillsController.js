const AboutSkills = require('../models/AboutSkills');
const SkillCategory = require('../models/SkillCategory');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/skills (public) — full section: intro + categories
const getSkillsSection = asyncHandler(async (req, res) => {
  const [skillsIntroParagraph, skillsCategories] = await Promise.all([
    AboutSkills.getIntro(),
    SkillCategory.findAll(),
  ]);
  res.json({ success: true, data: { skillsIntroParagraph, skillsCategories } });
});

// PUT /api/skills/intro (admin)
const updateIntro = asyncHandler(async (req, res) => {
  const { skillsIntroParagraph } = req.body;
  const intro = await AboutSkills.updateIntro(skillsIntroParagraph || '');
  res.json({ success: true, data: { skillsIntroParagraph: intro } });
});

// POST /api/skills/categories (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryDescription, subSkills } = req.body;
  if (!categoryName) throw new ApiError(400, 'categoryName is required.');
  const category = await SkillCategory.create({ categoryName, categoryDescription, subSkills });
  res.status(201).json({ success: true, data: category });
});

// PUT /api/skills/categories/:id (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const existing = await SkillCategory.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Skill category not found.');
  const { categoryName, categoryDescription, subSkills } = req.body;
  const category = await SkillCategory.update(req.params.id, { categoryName, categoryDescription, subSkills });
  res.json({ success: true, data: category });
});

// DELETE /api/skills/categories/:id (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const existing = await SkillCategory.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Skill category not found.');
  await SkillCategory.softDelete(req.params.id);
  res.json({ success: true, message: 'Skill category deleted.' });
});

module.exports = { getSkillsSection, updateIntro, createCategory, updateCategory, deleteCategory };
