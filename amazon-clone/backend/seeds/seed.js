require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '💻' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: 'Clothing', slug: 'clothing', icon: '👕' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { name: 'Sports & Outdoors', slug: 'sports', icon: '⚽' },
  { name: 'Toys & Games', slug: 'toys', icon: '🎮' },
  { name: 'Beauty', slug: 'beauty', icon: '💄' },
  { name: 'Automotive', slug: 'automotive', icon: '🚗' },
];

const products = [
  // Electronics
  {
    name: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium',
    description: 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 134900, original_price: 139900, category_slug: 'electronics', brand: 'Apple',
    stock: 50, rating: 4.7, reviews: 2847, is_prime: true, is_featured: true,
    specs: { Display: '6.7-inch Super Retina XDR', Processor: 'A17 Pro', RAM: '8GB', Storage: '256GB', Camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', Battery: '4422mAh' },
    images: [
      'https://images.unsplash.com/photo-1696446702183-8e96f94b0929?w=600',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
    ]
  },
  {
    name: 'Samsung 65-inch QLED 4K Smart TV (QN65Q80C)',
    description: 'Quantum HDR technology and Neural Quantum Processor 4K deliver stunning picture quality with deep blacks and vibrant colors.',
    price: 89990, original_price: 129900, category_slug: 'electronics', brand: 'Samsung',
    stock: 20, rating: 4.5, reviews: 1203, is_prime: true, is_featured: true,
    specs: { Display: '65-inch QLED', Resolution: '4K UHD', HDR: 'Quantum HDR', 'Smart TV': 'Tizen OS', Connectivity: 'Wi-Fi, Bluetooth 5.2', HDMI: '4 ports' },
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600',
      'https://images.unsplash.com/photo-1571415060716-baff5ea5e8a3?w=600',
    ]
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with Auto Noise Canceling Optimizer. Up to 30-hour battery life with quick charging.',
    price: 26990, original_price: 34990, category_slug: 'electronics', brand: 'Sony',
    stock: 100, rating: 4.8, reviews: 5621, is_prime: true, is_featured: false,
    specs: { 'Driver Unit': '30mm', 'Frequency Response': '4Hz-40,000Hz', 'Battery Life': '30 hours', Charging: 'USB-C', Weight: '250g', Connectivity: 'Bluetooth 5.2' },
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    ]
  },
  {
    name: 'Apple MacBook Air 15-inch M3 Chip (8GB RAM, 256GB SSD)',
    description: 'MacBook Air with M3 is our thinnest, lightest, most portable Mac ever. The powerful M3 chip enables unprecedented performance and battery life.',
    price: 134900, original_price: 134900, category_slug: 'electronics', brand: 'Apple',
    stock: 35, rating: 4.9, reviews: 987, is_prime: true, is_featured: true,
    specs: { Chip: 'Apple M3', RAM: '8GB Unified', Storage: '256GB SSD', Display: '15.3-inch Liquid Retina', Battery: '18-hour', Weight: '1.51kg' },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1611186871525-ac85e72cfc5a?w=600',
    ]
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Our most advanced Master Series Mouse for precision and comfort. Magspeed Electromagnetic Scrolling with near-silent clicks.',
    price: 8495, original_price: 9995, category_slug: 'electronics', brand: 'Logitech',
    stock: 200, rating: 4.6, reviews: 3241, is_prime: true, is_featured: false,
    specs: { DPI: '200-8000', Buttons: '7', Battery: '70 days', Connectivity: 'Bluetooth, USB Receiver', Weight: '141g', Scroll: 'MagSpeed Electromagnetic' },
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600',
    ]
  },
  {
    name: 'OnePlus 12R 5G (Iron Gray, 8GB RAM, 128GB Storage)',
    description: 'Powered by Snapdragon 8 Gen 1, OnePlus 12R delivers flagship performance at a mid-range price. Features 80W SUPERVOOC charging.',
    price: 39999, original_price: 42999, category_slug: 'electronics', brand: 'OnePlus',
    stock: 75, rating: 4.4, reviews: 1876, is_prime: true, is_featured: false,
    specs: { Display: '6.78-inch AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 1', RAM: '8GB', Storage: '128GB', Camera: '50MP + 8MP + 2MP', Battery: '5000mAh + 80W' },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
    ]
  },
  // Books
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    description: 'James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones.',
    price: 499, original_price: 799, category_slug: 'books', brand: 'Random House',
    stock: 500, rating: 4.8, reviews: 45231, is_prime: true, is_featured: true,
    specs: { Author: 'James Clear', Pages: '320', Publisher: 'Avery', Language: 'English', Format: 'Paperback', ISBN: '978-0735211292' },
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    ]
  },
  {
    name: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    description: 'Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people.',
    price: 349, original_price: 599, category_slug: 'books', brand: 'Jaico Publishing',
    stock: 300, rating: 4.7, reviews: 28640, is_prime: true, is_featured: false,
    specs: { Author: 'Morgan Housel', Pages: '256', Publisher: 'Harriman House', Language: 'English', Format: 'Paperback', ISBN: '978-0857197689' },
    images: [
      'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=600',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    ]
  },
  // Clothing
  {
    name: 'Amazon Essentials Men\'s Regular-Fit Short-Sleeve Polo Shirt',
    description: 'This polo shirt features a classic design that looks great for casual occasions. Made from comfortable, durable cotton fabric.',
    price: 999, original_price: 1499, category_slug: 'clothing', brand: 'Amazon Essentials',
    stock: 1000, rating: 4.3, reviews: 12450, is_prime: true, is_featured: false,
    specs: { Material: '100% Cotton', Fit: 'Regular', Collar: 'Polo', 'Care Instructions': 'Machine Wash', 'Available Sizes': 'S, M, L, XL, XXL' },
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600',
    ]
  },
  {
    name: 'Levi\'s Men\'s 511 Slim Fit Jeans',
    description: 'The 511 slim fit jean sits below the waist with a slim fit from hip to ankle. Perfect for everyday wear with a modern silhouette.',
    price: 2999, original_price: 3999, category_slug: 'clothing', brand: "Levi's",
    stock: 500, rating: 4.5, reviews: 8934, is_prime: true, is_featured: false,
    specs: { Material: '99% Cotton, 1% Elastane', Fit: 'Slim', Rise: 'Mid Rise', Closure: 'Zip Fly', 'Wash': 'Machine Wash' },
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600',
    ]
  },
  // Home & Kitchen
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart',
    description: 'The Duo combines 7 kitchen appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    price: 8999, original_price: 12999, category_slug: 'home-kitchen', brand: 'Instant Pot',
    stock: 150, rating: 4.7, reviews: 34521, is_prime: true, is_featured: true,
    specs: { Capacity: '6 Quart', Functions: '7-in-1', Programs: '14 Smart Programs', Material: 'Stainless Steel', Safety: '10+ Safety Features', 'Power': '1000W' },
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
    ]
  },
  {
    name: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
    description: 'Laser Detect technology reveals invisible dust. Piezo sensor counts and measures dust particles. Most powerful Dyson cord-free vacuum.',
    price: 52900, original_price: 62900, category_slug: 'home-kitchen', brand: 'Dyson',
    stock: 40, rating: 4.6, reviews: 2134, is_prime: true, is_featured: true,
    specs: { Suction: '230 AW', Battery: '60 min', Bin: '0.76L', Weight: '3.1kg', Filter: 'HEPA', 'Noise Level': '71dB' },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600',
    ]
  },
  // Sports
  {
    name: 'Boldfit Gym Bag for Men & Women - 45L Duffle Bag',
    description: 'Large capacity gym bag with separate shoe compartment. Water-resistant and durable for everyday gym use.',
    price: 1299, original_price: 2499, category_slug: 'sports', brand: 'Boldfit',
    stock: 300, rating: 4.4, reviews: 5678, is_prime: true, is_featured: false,
    specs: { Capacity: '45L', Material: 'Polyester', Dimensions: '55x28x28cm', 'Shoe Compartment': 'Yes', 'Water Resistant': 'Yes' },
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600',
    ]
  },
  {
    name: 'Nivia Pro Training Football (Size 5)',
    description: 'Professional grade football for training and matches. FIFA quality material with 32-panel design for optimal flight and control.',
    price: 849, original_price: 1299, category_slug: 'sports', brand: 'Nivia',
    stock: 200, rating: 4.3, reviews: 3421, is_prime: false, is_featured: false,
    specs: { Size: '5', Material: 'Synthetic Leather', Panels: '32', 'Bladder Type': 'Butyl', Weight: '400-440g', Circumference: '68-70cm' },
    images: [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600',
      'https://images.unsplash.com/photo-1537752695600-dfe4a67f5ea6?w=600',
    ]
  },
  // Toys & Games
  {
    name: 'LEGO Technic Bugatti Chiron 42083 Building Kit (3599 Pieces)',
    description: 'The iconic Bugatti Chiron recreated in stunning LEGO Technic detail. Features working 8-speed gearbox, active rear wing, and more.',
    price: 17999, original_price: 22999, category_slug: 'toys', brand: 'LEGO',
    stock: 60, rating: 4.9, reviews: 1876, is_prime: true, is_featured: true,
    specs: { Pieces: '3599', 'Recommended Age': '16+', Dimensions: '56x25x15cm', Scale: '1:8', Features: 'Working gearbox, Rear wing' },
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
      'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600',
    ]
  },
  // Beauty
  {
    name: 'Minimalist 10% Niacinamide Face Serum for Acne Marks & Large Pores',
    description: 'High-strength Vitamin B3 serum to reduce the appearance of pores, uneven skin tone, and dullness. Suitable for all skin types.',
    price: 599, original_price: 799, category_slug: 'beauty', brand: 'Minimalist',
    stock: 400, rating: 4.5, reviews: 18932, is_prime: true, is_featured: false,
    specs: { Volume: '30ml', 'Key Ingredient': 'Niacinamide 10%', 'Skin Type': 'All', 'Free From': 'Fragrance, Alcohol', Usage: 'Morning & Night' },
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
    ]
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Starting database seed...');

    // Insert default user
    await client.query(`
      INSERT INTO users (id, name, email, is_default)
      VALUES ('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', true)
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Default user created');

    // Insert categories
    const categoryMap = {};
    for (const cat of categories) {
      const res = await client.query(
        `INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [cat.name, cat.slug, cat.icon]
      );
      categoryMap[cat.slug] = res.rows[0].id;
    }
    console.log('✅ Categories seeded');

    // Insert products
    for (const p of products) {
      const catId = categoryMap[p.category_slug];
      const productRes = await client.query(
        `INSERT INTO products (name, description, price, original_price, category_id, brand, stock_quantity, rating, review_count, is_prime, is_featured, specifications)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT DO NOTHING RETURNING id`,
        [p.name, p.description, p.price, p.original_price, catId, p.brand, p.stock, p.rating, p.reviews, p.is_prime, p.is_featured, JSON.stringify(p.specs)]
      );
      if (productRes.rows.length > 0) {
        const productId = productRes.rows[0].id;
        for (let i = 0; i < p.images.length; i++) {
          await client.query(
            `INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES ($1, $2, $3, $4)`,
            [productId, p.images[i], i, i === 0]
          );
        }
      }
    }
    console.log('✅ Products seeded');

    // Create cart for default user
    await client.query(
      `INSERT INTO carts (user_id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING`
    );

    await client.query('COMMIT');
    console.log('🎉 Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', err);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

seed();
