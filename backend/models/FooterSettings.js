const { pool } = require('../config/db');
const { parseJSON, toJSON } = require('../utils/json');

function serialize(row) {
  if (!row) return null;
  return {
    footerSummaryText: row.footer_summary_text,
    footerSkillsList: parseJSON(row.footer_skills_list, []),
    joinUsLinks: parseJSON(row.join_us_links, []),
    updatedAt: row.updated_at,
  };
}

const FooterSettings = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM footer_settings WHERE id = 1 LIMIT 1');
    return serialize(rows[0]);
  },

  async update(data) {
    const [existing] = await pool.query('SELECT id FROM footer_settings WHERE id = 1 LIMIT 1');
    const footerSkillsList = toJSON(data.footerSkillsList || []);
    const joinUsLinks = toJSON(data.joinUsLinks || []);

    if (existing.length) {
      await pool.query(
        'UPDATE footer_settings SET footer_summary_text = ?, footer_skills_list = ?, join_us_links = ? WHERE id = 1',
        [data.footerSummaryText, footerSkillsList, joinUsLinks]
      );
    } else {
      await pool.query(
        'INSERT INTO footer_settings (id, footer_summary_text, footer_skills_list, join_us_links) VALUES (1, ?, ?, ?)',
        [data.footerSummaryText, footerSkillsList, joinUsLinks]
      );
    }
    return this.get();
  },
};

module.exports = FooterSettings;
