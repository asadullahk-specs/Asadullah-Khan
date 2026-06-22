const { pool } = require('../config/db');
const { parseJSON, toJSON } = require('../utils/json');

function serialize(row) {
  if (!row) return null;
  return {
    aboutPageParagraphs: parseJSON(row.paragraphs, []),
    aboutPageSkills: parseJSON(row.skills, []),
    cvAttachmentUrl: row.cv_attachment_url,
    updatedAt: row.updated_at,
  };
}

const AboutPage = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM about_pages WHERE id = 1 LIMIT 1');
    return serialize(rows[0]);
  },

  async update(data) {
    const [existing] = await pool.query('SELECT id FROM about_pages WHERE id = 1 LIMIT 1');
    const paragraphs = toJSON(data.aboutPageParagraphs || []);
    const skills = toJSON(data.aboutPageSkills || []);
    const cvUrl = data.cvAttachmentUrl;

    if (existing.length) {
      await pool.query('UPDATE about_pages SET paragraphs = ?, skills = ?, cv_attachment_url = ? WHERE id = 1', [
        paragraphs,
        skills,
        cvUrl,
      ]);
    } else {
      await pool.query(
        'INSERT INTO about_pages (id, paragraphs, skills, cv_attachment_url) VALUES (1, ?, ?, ?)',
        [paragraphs, skills, cvUrl]
      );
    }
    return this.get();
  },
};

module.exports = AboutPage;
