const Upload = require('../models/Upload');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { classifyFileType } = require('../middleware/uploadMiddleware');
const { buildFileUrl, deleteFileByName } = require('../services/fileService');

// POST /api/uploads (admin) — multipart/form-data, field name "file"
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file received. Attach a file under the "file" field.');
  }

  const fileUrl = buildFileUrl(req, req.file.filename);
  const saved = await Upload.create({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileUrl,
    mimeType: req.file.mimetype,
    fileType: classifyFileType(req.file.mimetype),
    sizeBytes: req.file.size,
  });

  res.status(201).json({ success: true, data: saved });
});

// GET /api/uploads (admin)
const listUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.findAll();
  res.json({ success: true, data: uploads });
});

// DELETE /api/uploads/:id (admin)
const deleteUpload = asyncHandler(async (req, res) => {
  const existing = await Upload.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Upload not found.');
  await Upload.softDelete(req.params.id);
  deleteFileByName(existing.fileName);
  res.json({ success: true, message: 'File deleted.' });
});

module.exports = { uploadFile, listUploads, deleteUpload };
