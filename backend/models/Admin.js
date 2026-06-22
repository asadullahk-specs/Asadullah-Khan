const { pool } = require('../config/db');

const Admin = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM admins WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS c FROM admins');
    return rows[0].c;
  },

  async create({ name, email, passwordHash }) {
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return this.findById(result.insertId);
  },

  async updatePassword(id, passwordHash) {
    await pool.query('UPDATE admins SET password = ? WHERE id = ?', [passwordHash, id]);
  },

  async updateProfile(id, { name, email }) {
    await pool.query('UPDATE admins SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return this.findById(id);
  },
};

module.exports = Admin;
