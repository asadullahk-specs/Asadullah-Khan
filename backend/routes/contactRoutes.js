const express = require('express');
const { getContactSettings, updateContactSettings } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getContactSettings);
router.put('/', protect, updateContactSettings);

module.exports = router;
