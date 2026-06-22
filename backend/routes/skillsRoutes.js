const express = require('express');
const {
  getSkillsSection,
  updateIntro,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/skillsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getSkillsSection);
router.put('/intro', protect, updateIntro);
router.post('/categories', protect, createCategory);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

module.exports = router;
