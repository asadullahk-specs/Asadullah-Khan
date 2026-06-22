const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../middleware/uploadMiddleware');

// Builds the publicly-accessible URL for a file stored in /uploads.
// server.js serves UPLOAD_DIR statically at /uploads, so the URL is
// always relative to the backend's own origin.
function buildFileUrl(req, fileName) {
  return `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
}

// Deletes a file from disk by its stored file_name. Safe to call even
// if the file is already missing (e.g. manually removed).
function deleteFileByName(fileName) {
  if (!fileName) return;
  const filePath = path.join(UPLOAD_DIR, fileName);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete file:', filePath, err.message);
    }
  });
}

module.exports = { buildFileUrl, deleteFileByName };
