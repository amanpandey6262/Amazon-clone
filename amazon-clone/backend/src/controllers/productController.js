const { pool } = require('../config/database');

// GET /api/products - List products with filters
const getProducts = async (req, res) => {
  try {
    const { search, category, sort = 'featured', page = 1, limit = 20, min_price, max_price } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let paramIdx = 1;

    let whereConditions = ['p.stock_quantity > 0'];

    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    if (min_price) {
      whereConditions.push(`p.price >= $${paramIdx}`);
      params.push(parseFloat(min_price));
      paramIdx++;
    }

    if (max_price) {
      whereConditions.push(`p.price <= $${paramIdx}`);
      params.push(parseFloat(max_price));
      paramIdx++;
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY p.is_featured DESC, p.created_at DESC';
    if (sort === 'price_asc') orderClause = 'ORDER BY p.price ASC';
    else if (sort === 'price_desc') orderClause = 'ORDER BY p.price DESC';
    else if (sort === 'rating') orderClause = 'ORDER BY p.rating DESC';
    else if (sort === 'newest') orderClause = 'ORDER BY p.created_at DESC';

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT 
        p.id, p.name, p.price, p.original_price, p.rating, p.review_count,
        p.is_prime, p.is_featured, p.brand, p.stock_quantity,
        c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;
    params.push(parseInt(limit), offset);

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, paramIdx - 1)),
      pool.query(dataQuery, params),
    ]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      products: dataResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /api/products/:id - Single product with all details
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;

    const imagesQuery = `
      SELECT image_url, alt_text, sort_order, is_primary
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order ASC
    `;

    const relatedQuery = `
      SELECT 
        p.id, p.name, p.price, p.original_price, p.rating, p.review_count, p.is_prime,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      WHERE p.category_id = (SELECT category_id FROM products WHERE id = $1)
        AND p.id != $1
        AND p.stock_quantity > 0
      ORDER BY p.rating DESC
      LIMIT 4
    `;

    const [productResult, imagesResult, relatedResult] = await Promise.all([
      pool.query(productQuery, [id]),
      pool.query(imagesQuery, [id]),
      pool.query(relatedQuery, [id]),
    ]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    product.images = imagesResult.rows;
    product.related_products = relatedResult.rows;

    res.json(product);
  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// GET /api/products/featured - Featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.price, p.original_price, p.rating, p.review_count, p.is_prime, p.brand,
        c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.stock_quantity > 0
      ORDER BY p.rating DESC
      LIMIT 8
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
};

module.exports = { getProducts, getProductById, getFeaturedProducts };
