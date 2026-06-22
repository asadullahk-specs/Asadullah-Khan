const mysql = require('mysql2/promise');
require('dotenv').config();

// Centralized MySQL connection pool. Every model imports `pool` from here
// instead of opening its own connection.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Quick helper to confirm the DB is reachable when the server boots.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ MySQL connected:', process.env.DB_NAME || 'portfolio_db');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error(
      '   Check backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and make sure MySQL is running.'
    );
  }
}

module.exports = { pool, testConnection };
