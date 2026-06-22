const express = require('express');
const {
  getProjects,
  getCategories,
  getPageSettings,
  updatePageSettings,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Specific sub-paths MUST come before the generic "/:id" route below.
router.get('/categories', getCategories);
router.get('/page-settings', getPageSettings);
router.put('/page-settings', protect, updatePageSettings);

router.get('/', getProjects);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
