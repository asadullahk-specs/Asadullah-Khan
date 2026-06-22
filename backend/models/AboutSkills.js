const { pool } = require('../config/db');

const AboutSkills = {
  async getIntro() {
    const [rows] = await pool.query('SELECT * FROM about_skills WHERE id = 1 LIMIT 1');
    return rows[0] ? rows[0].intro_paragraph : '';
  },

  async updateIntro(introParagraph) {
    const [existing] = await pool.query('SELECT id FROM about_skills WHERE id = 1 LIMIT 1');
    if (existing.length) {
      await pool.query('UPDATE about_skills SET intro_paragraph = ? WHERE id = 1', [introParagraph]);
    } else {
      await pool.query('INSERT INTO about_skills (id, intro_paragraph) VALUES (1, ?)', [introParagraph]);
    }
    return this.getIntro();
  },
};

module.exports = AboutSkills;
