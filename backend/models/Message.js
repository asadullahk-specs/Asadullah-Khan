const { pool } = require('../config/db');

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    isRead: !!row.is_read,
    createdAt: row.created_at,
  };
}

const Message = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM messages WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC'
    );
    return rows.map(serialize);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM messages WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
    return serialize(rows[0]);
  },

  async create({ firstName, lastName, email, phone, message }) {
    const [result] = await pool.query(
      'INSERT INTO messages (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone || null, message]
    );
    return this.findById(result.insertId);
  },

  async setRead(id, isRead) {
    await pool.query('UPDATE messages SET is_read = ? WHERE id = ? AND deleted_at IS NULL', [isRead ? 1 : 0, id]);
    return this.findById(id);
  },

  async softDelete(id) {
    await pool.query('UPDATE messages SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async unreadCount() {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS c FROM messages WHERE deleted_at IS NULL AND is_read = 0'
    );
    return rows[0].c;
  },
};

module.exports = Message;
