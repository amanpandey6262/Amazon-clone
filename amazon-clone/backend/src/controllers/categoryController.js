const { pool } = require('../config/database');

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.stock_quantity > 0
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = { getCategories };
