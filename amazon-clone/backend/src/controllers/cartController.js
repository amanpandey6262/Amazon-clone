const { pool } = require('../config/database');
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// Ensure cart exists for user
const ensureCart = async (client, userId) => {
  const result = await client.query(
    `INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW() RETURNING id`,
    [userId]
  );
  return result.rows[0].id;
};

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const cartQuery = `
      SELECT 
        ci.id, ci.quantity, ci.added_at,
        p.id as product_id, p.name, p.price, p.original_price, p.is_prime,
        p.stock_quantity, p.brand,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      WHERE c.user_id = $1
      ORDER BY ci.added_at DESC
    `;
    const result = await pool.query(cartQuery, [userId]);
    const items = result.rows;
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    res.json({ items, subtotal: subtotal.toFixed(2), item_count: items.reduce((s, i) => s + i.quantity, 0) });
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// POST /api/cart/items
const addToCart = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = DEFAULT_USER_ID;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) return res.status(400).json({ error: 'product_id is required' });

    // Check product exists and has stock
    const productResult = await client.query(
      'SELECT id, stock_quantity FROM products WHERE id = $1', [product_id]
    );
    if (productResult.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    if (productResult.rows[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await client.query('BEGIN');
    const cartId = await ensureCart(client, userId);

    await client.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, product_id, parseInt(quantity)]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('addToCart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  } finally {
    client.release();
  }
};

// PATCH /api/cart/items/:itemId
const updateCartItem = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = DEFAULT_USER_ID;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ error: 'Quantity must be >= 1' });

    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE cart_items ci SET quantity = $1
       FROM carts c WHERE ci.cart_id = c.id AND c.user_id = $2 AND ci.id = $3
       RETURNING ci.id`,
      [parseInt(quantity), userId, itemId]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await client.query('COMMIT');
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update cart item' });
  } finally {
    client.release();
  }
};

// DELETE /api/cart/items/:itemId
const removeCartItem = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = DEFAULT_USER_ID;
    const { itemId } = req.params;

    await client.query('BEGIN');
    const result = await client.query(
      `DELETE FROM cart_items ci
       USING carts c WHERE ci.cart_id = c.id AND c.user_id = $1 AND ci.id = $2
       RETURNING ci.id`,
      [userId, itemId]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await client.query('COMMIT');
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to remove cart item' });
  } finally {
    client.release();
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    await pool.query(
      `DELETE FROM cart_items USING carts WHERE cart_items.cart_id = carts.id AND carts.user_id = $1`,
      [userId]
    );
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
