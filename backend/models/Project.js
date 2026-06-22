const { pool } = require('../config/db');
const { parseJSON, toJSON } = require('../utils/json');

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    technologies: parseJSON(row.technologies, []),
    projectImage: row.project_image,
    detailsLink: row.details_link,
    isRecent: !!row.is_recent,
    projectCategory: row.project_category,
    sortOrder: row.sort_order,
  };
}

const Project = {
  async findAll({ category, recentOnly } = {}) {
    let sql = 'SELECT * FROM projects WHERE deleted_at IS NULL';
    const params = [];
    if (category && category !== 'All Projects' && category !== 'All') {
      sql += ' AND project_category = ?';
      params.push(category);
    }
    if (recentOnly) {
      sql += ' AND is_recent = 1';
    }
    sql += ' ORDER BY sort_order ASC, id ASC';
    const [rows] = await pool.query(sql, params);
    return rows.map(serialize);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
    return serialize(rows[0]);
  },

  // Category name -> project count, used by the Projects page sidebar.
  async categoryCounts() {
    const [rows] = await pool.query(
      "SELECT project_category AS name, COUNT(*) AS count FROM projects WHERE deleted_at IS NULL AND project_category IS NOT NULL AND project_category <> '' GROUP BY project_category ORDER BY project_category ASC"
    );
    return rows;
  },

  async create({ title, description, technologies, projectImage, detailsLink, isRecent, projectCategory }) {
    const [maxRow] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS nextOrder FROM projects WHERE deleted_at IS NULL'
    );
    const [result] = await pool.query(
      'INSERT INTO projects (title, description, technologies, project_image, details_link, is_recent, project_category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        description,
        toJSON(technologies || []),
        projectImage,
        detailsLink,
        isRecent ? 1 : 0,
        projectCategory,
        maxRow[0].nextOrder,
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, { title, description, technologies, projectImage, detailsLink, isRecent, projectCategory }) {
    await pool.query(
      'UPDATE projects SET title = ?, description = ?, technologies = ?, project_image = ?, details_link = ?, is_recent = ?, project_category = ? WHERE id = ? AND deleted_at IS NULL',
      [
        title,
        description,
        toJSON(technologies || []),
        projectImage,
        detailsLink,
        isRecent ? 1 : 0,
        projectCategory,
        id,
      ]
    );
    return this.findById(id);
  },

  async softDelete(id) {
    await pool.query('UPDATE projects SET deleted_at = NOW() WHERE id = ?', [id]);
  },
};

module.exports = Project;
