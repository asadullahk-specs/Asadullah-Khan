const { pool } = require('../config/db');

function serialize(row) {
  if (!row) return null;
  return {
    siteName: row.site_name,
    siteTagline: row.site_tagline,
    seoDescription: row.seo_description,
    favicon: row.favicon,
    adminEmail: row.admin_email,
    projectsPageIntroText: row.projects_page_intro_text,
    updatedAt: row.updated_at,
  };
}

const SiteSettings = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1 LIMIT 1');
    return serialize(rows[0]);
  },

  async update(data) {
    const current = await this.get();
    const merged = { ...current, ...data };
    const [existing] = await pool.query('SELECT id FROM site_settings WHERE id = 1 LIMIT 1');
    const params = [
      merged.siteName,
      merged.siteTagline,
      merged.seoDescription,
      merged.favicon,
      merged.adminEmail,
      merged.projectsPageIntroText,
    ];

    if (existing.length) {
      await pool.query(
        'UPDATE site_settings SET site_name = ?, site_tagline = ?, seo_description = ?, favicon = ?, admin_email = ?, projects_page_intro_text = ? WHERE id = 1',
        params
      );
    } else {
      await pool.query(
        'INSERT INTO site_settings (id, site_name, site_tagline, seo_description, favicon, admin_email, projects_page_intro_text) VALUES (1, ?, ?, ?, ?, ?, ?)',
        params
      );
    }
    return this.get();
  },
};

module.exports = SiteSettings;
