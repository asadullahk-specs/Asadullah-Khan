const express = require('express');
const { login, getMe, changePassword, changeEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.post('/change-email', protect, changeEmail);

module.exports = router;
