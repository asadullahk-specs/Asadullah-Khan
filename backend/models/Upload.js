const { pool } = require('../config/db');

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.original_name,
    fileName: row.file_name,
    url: row.file_url,
    type: row.file_type,
    mimeType: row.mime_type,
    size: row.size_bytes,
    createdAt: row.created_at,
  };
}

const Upload = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM uploads WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC'
    );
    return rows.map(serialize);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM uploads WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
    return serialize(rows[0]);
  },

  async create({ originalName, fileName, filePath, fileUrl, mimeType, fileType, sizeBytes }) {
    const [result] = await pool.query(
      'INSERT INTO uploads (original_name, file_name, file_path, file_url, mime_type, file_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [originalName, fileName, filePath, fileUrl, mimeType, fileType, sizeBytes]
    );
    return this.findById(result.insertId);
  },

  async softDelete(id) {
    await pool.query('UPDATE uploads SET deleted_at = NOW() WHERE id = ?', [id]);
  },
};

module.exports = Upload;
