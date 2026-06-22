const express = require('express');
const { getFooter, updateFooter } = require('../controllers/footerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFooter);
router.put('/', protect, updateFooter);

module.exports = router;
