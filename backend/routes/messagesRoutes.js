const express = require('express');
const {
  submitMessage,
  getMessages,
  getMessage,
  markRead,
  deleteMessage,
} = require('../controllers/messagesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitMessage); // public — contact form
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
