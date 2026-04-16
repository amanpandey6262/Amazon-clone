const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// Generate order number like Amazon: 408-XXXXXXX-XXXXXXX
const generateOrderNumber = () => {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000000 + Math.random() * 9000000);
  const part3 = Math.floor(1000000 + Math.random() * 9000000);
  return `${part1}-${part2}-${part3}`;
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const ordersResult = await pool.query(
      `SELECT o.*, a.full_name, a.city, a.state, a.postal_code, a.address_line1
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;
    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (err) {
    console.error('getOrders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT o.*, 
        a.full_name, a.phone, a.address_line1, a.address_line2, 
        a.city, a.state, a.postal_code, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;

    res.json(order);
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = DEFAULT_USER_ID;
    const { shipping_address, payment_method = 'cod' } = req.body;

    // Validate shipping address
    const { full_name, phone, address_line1, city, state, postal_code, country = 'India' } = shipping_address || {};
    if (!full_name || !address_line1 || !city || !state || !postal_code) {
      return res.status(400).json({ error: 'Incomplete shipping address' });
    }

    await client.query('BEGIN');

    // Get cart items
    const cartResult = await client.query(
      `SELECT ci.quantity, p.id as product_id, p.name, p.price, p.stock_quantity,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
       FROM carts c
       JOIN cart_items ci ON ci.cart_id = c.id
       JOIN products p ON p.id = ci.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;

    // Validate stock
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    // Save address
    const addressResult = await client.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line1, city, state, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, full_name, phone, address_line1, city, state, postal_code, country]
    );
    const addressId = addressResult.rows[0].id;

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const shippingCost = subtotal >= 499 ? 0 : 40;
    const taxAmount = parseFloat((subtotal * 0.18).toFixed(2));
    const totalAmount = parseFloat((subtotal + shippingCost + taxAmount).toFixed(2));

    // Estimated delivery: 3-5 business days
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, address_id, subtotal, shipping_cost, tax_amount, total_amount, status, payment_method, estimated_delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8, $9) RETURNING *`,
      [generateOrderNumber(), userId, addressId, subtotal, shippingCost, taxAmount, totalAmount, payment_method, estimatedDelivery]
    );
    const order = orderResult.rows[0];

    // Create order items & decrement stock
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.product_id, item.name, item.image_url, item.price, item.quantity, parseFloat(item.price) * item.quantity]
      );
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query(
      `DELETE FROM cart_items USING carts WHERE cart_items.cart_id = carts.id AND carts.user_id = $1`,
      [userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      ...order,
      items: cartItems.map(item => ({
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_image: item.image_url,
        subtotal: parseFloat(item.price) * item.quantity,
      }))
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createOrder error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    client.release();
  }
};

module.exports = { getOrders, getOrderById, createOrder };
