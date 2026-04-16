const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initializeDatabase = async () => {
  try {
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    await pool.query(schemaSQL);
    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    throw err;
  }
};

module.exports = { pool, initializeDatabase };
