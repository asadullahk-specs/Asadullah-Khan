const { pool } = require('../config/db');
const { parseJSON, toJSON } = require('../utils/json');

// hero_sections is a singleton table — there is always exactly one row (id = 1).
// It backs BOTH the Home "Hero" section and the Home "About Preview" section,
// matching the admin grouping described in the project spec.

function serialize(row) {
  if (!row) return null;
  return {
    staticHeading: row.static_heading,
    typewriterTexts: parseJSON(row.typewriter_texts, []),
    paragraphText: row.paragraph_text,
    skills: parseJSON(row.skills, []),
    heroImage: row.hero_image,
    cvDoc: row.cv_doc,
    aboutPreviewHeading: row.about_preview_heading,
    aboutPreviewText: row.about_preview_text,
    aboutPreviewImage: row.about_preview_image,
    updatedAt: row.updated_at,
  };
}

const Hero = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM hero_sections WHERE id = 1 LIMIT 1');
    return serialize(rows[0]);
  },

  async update(data) {
    const [existing] = await pool.query('SELECT id FROM hero_sections WHERE id = 1 LIMIT 1');
    const fields = {
      static_heading: data.staticHeading,
      typewriter_texts: toJSON(data.typewriterTexts || []),
      paragraph_text: data.paragraphText,
      skills: toJSON(data.skills || []),
      hero_image: data.heroImage,
      cv_doc: data.cvDoc,
      about_preview_heading: data.aboutPreviewHeading,
      about_preview_text: data.aboutPreviewText,
      about_preview_image: data.aboutPreviewImage,
    };

    if (existing.length) {
      await pool.query('UPDATE hero_sections SET ? WHERE id = 1', [fields]);
    } else {
      await pool.query('INSERT INTO hero_sections (id, static_heading, typewriter_texts, paragraph_text, skills, hero_image, cv_doc, about_preview_heading, about_preview_text, about_preview_image) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        fields.static_heading,
        fields.typewriter_texts,
        fields.paragraph_text,
        fields.skills,
        fields.hero_image,
        fields.cv_doc,
        fields.about_preview_heading,
        fields.about_preview_text,
        fields.about_preview_image,
      ]);
    }
    return this.get();
  },
};

module.exports = Hero;
