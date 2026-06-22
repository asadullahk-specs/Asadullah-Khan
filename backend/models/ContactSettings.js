const { pool } = require('../config/db');

function serialize(row) {
  if (!row) return null;
  return {
    contactSubtitle: row.contact_subtitle,
    availabilityText: row.availability_text,
    adminEmail: row.admin_email,
    adminPhone: row.admin_phone,
    adminLocation: row.admin_location,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    updatedAt: row.updated_at,
  };
}

const ContactSettings = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM contact_settings WHERE id = 1 LIMIT 1');
    return serialize(rows[0]);
  },

  async update(data) {
    const [existing] = await pool.query('SELECT id FROM contact_settings WHERE id = 1 LIMIT 1');
    const params = [
      data.contactSubtitle,
      data.availabilityText,
      data.adminEmail,
      data.adminPhone,
      data.adminLocation,
      data.linkedinUrl,
      data.githubUrl,
    ];

    if (existing.length) {
      await pool.query(
        'UPDATE contact_settings SET contact_subtitle = ?, availability_text = ?, admin_email = ?, admin_phone = ?, admin_location = ?, linkedin_url = ?, github_url = ? WHERE id = 1',
        params
      );
    } else {
      await pool.query(
        'INSERT INTO contact_settings (id, contact_subtitle, availability_text, admin_email, admin_phone, admin_location, linkedin_url, github_url) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
        params
      );
    }
    return this.get();
  },
};

module.exports = ContactSettings;
