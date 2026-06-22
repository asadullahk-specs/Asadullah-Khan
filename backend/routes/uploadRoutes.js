const express = require('express');
const { uploadFile, listUploads, deleteUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protect, listUploads);
router.post('/', protect, upload.single('file'), uploadFile);
router.delete('/:id', protect, deleteUpload);

module.exports = router;
