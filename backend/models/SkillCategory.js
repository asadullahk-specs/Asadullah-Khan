const { pool } = require('../config/db');
const { parseJSON, toJSON } = require('../utils/json');

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    categoryName: row.category_name,
    categoryDescription: row.category_description,
    subSkills: parseJSON(row.sub_skills, []),
    sortOrder: row.sort_order,
  };
}

const SkillCategory = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM skill_categories WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC'
    );
    return rows.map(serialize);
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM skill_categories WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [id]
    );
    return serialize(rows[0]);
  },

  async create({ categoryName, categoryDescription, subSkills }) {
    const [maxRow] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS nextOrder FROM skill_categories WHERE deleted_at IS NULL'
    );
    const [result] = await pool.query(
      'INSERT INTO skill_categories (category_name, category_description, sub_skills, sort_order) VALUES (?, ?, ?, ?)',
      [categoryName, categoryDescription, toJSON(subSkills || []), maxRow[0].nextOrder]
    );
    return this.findById(result.insertId);
  },

  async update(id, { categoryName, categoryDescription, subSkills }) {
    await pool.query(
      'UPDATE skill_categories SET category_name = ?, category_description = ?, sub_skills = ? WHERE id = ? AND deleted_at IS NULL',
      [categoryName, categoryDescription, toJSON(subSkills || []), id]
    );
    return this.findById(id);
  },

  async softDelete(id) {
    await pool.query('UPDATE skill_categories SET deleted_at = NOW() WHERE id = ?', [id]);
  },
};

module.exports = SkillCategory;
