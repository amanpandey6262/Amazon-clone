const { pool } = require('../config/database');
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

const getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wi.id, wi.added_at,
        p.id as product_id, p.name, p.price, p.original_price, p.rating, p.review_count, p.is_prime,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
       FROM wishlist_items wi
       JOIN products p ON p.id = wi.product_id
       WHERE wi.user_id = $1
       ORDER BY wi.added_at DESC`,
      [DEFAULT_USER_ID]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id required' });

    const existing = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [DEFAULT_USER_ID, product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2', [DEFAULT_USER_ID, product_id]);
      res.json({ wishlisted: false, message: 'Removed from wishlist' });
    } else {
      await pool.query('INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2)', [DEFAULT_USER_ID, product_id]);
      res.json({ wishlisted: true, message: 'Added to wishlist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
};

const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [DEFAULT_USER_ID, productId]
    );
    res.json({ wishlisted: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
};

module.exports = { getWishlist, toggleWishlist, checkWishlist };
