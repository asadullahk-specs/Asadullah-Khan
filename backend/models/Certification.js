const { pool } = require('../config/db');

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    duration: row.duration,
    certificateImage: row.certificate_image,
    pdfDocument: row.pdf_document,
    sortOrder: row.sort_order,
  };
}

const Certification = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM certifications WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC'
    );
    return rows.map(serialize);
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM certifications WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [id]
    );
    return serialize(rows[0]);
  },

  async create({ title, issuer, duration, certificateImage, pdfDocument }) {
    const [maxRow] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS nextOrder FROM certifications WHERE deleted_at IS NULL'
    );
    const [result] = await pool.query(
      'INSERT INTO certifications (title, issuer, duration, certificate_image, pdf_document, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, issuer, duration, certificateImage, pdfDocument, maxRow[0].nextOrder]
    );
    return this.findById(result.insertId);
  },

  async update(id, { title, issuer, duration, certificateImage, pdfDocument }) {
    await pool.query(
      'UPDATE certifications SET title = ?, issuer = ?, duration = ?, certificate_image = ?, pdf_document = ? WHERE id = ? AND deleted_at IS NULL',
      [title, issuer, duration, certificateImage, pdfDocument, id]
    );
    return this.findById(id);
  },

  async softDelete(id) {
    await pool.query('UPDATE certifications SET deleted_at = NOW() WHERE id = ?', [id]);
  },
};

module.exports = Certification;
