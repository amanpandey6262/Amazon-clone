# 🛒 Amazon Clone — SDE Intern Fullstack Assignment

A full-stack e-commerce web application that closely replicates Amazon's design and user experience, built with React, Node.js, Express, and PostgreSQL.

## 🔗 Links
- **GitHub Repository**: `[your-github-repo-url]`
- **Live Demo**: `[your-deployed-url]`

---

## ✨ Features Implemented

### Core Features (All Required)
| Feature | Status |
|---|---|
| Product Listing with grid layout | ✅ |
| Search by product name | ✅ |
| Filter by category | ✅ |
| Sort (featured, price, rating, newest) | ✅ |
| Product Detail Page | ✅ |
| Image carousel (multiple images) | ✅ |
| Specifications table | ✅ |
| Stock availability status | ✅ |
| Add to Cart button | ✅ |
| Buy Now button | ✅ |
| Shopping Cart (view/update/remove) | ✅ |
| Cart summary with subtotal + tax | ✅ |
| 3-step Checkout (address → payment → review) | ✅ |
| Order placement | ✅ |
| Order confirmation with Order ID | ✅ |

### Bonus Features
| Feature | Status |
|---|---|
| Responsive design (mobile/tablet/desktop) | ✅ |
| Order History page | ✅ |
| Wishlist functionality | ✅ |
| Price filter | ✅ |
| Pagination | ✅ |
| Related products | ✅ |

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                    Database Design                       │
├──────────┬──────────────────┬────────────────────────────┤
│ Table    │ Key Columns      │ Purpose                    │
├──────────┼──────────────────┼────────────────────────────┤
│ users    │ id, name, email  │ Default user account       │
│ categories│ id, name, slug  │ Product categories         │
│ products │ id, name, price, │ Product catalog            │
│          │ category_id,     │                            │
│          │ specifications   │                            │
│ product_ │ id, product_id,  │ Multiple images per product│
│ images   │ image_url        │                            │
│ carts    │ id, user_id      │ One cart per user          │
│ cart_    │ id, cart_id,     │ Items in cart              │
│ items    │ product_id, qty  │                            │
│ addresses│ id, user_id,     │ Shipping addresses         │
│          │ city, state...   │                            │
│ orders   │ id, order_number,│ Placed orders              │
│          │ total_amount...  │                            │
│ order_   │ id, order_id,    │ Snapshot of items at       │
│ items    │ product_name...  │ time of purchase           │
│ wishlist_│ id, user_id,     │ Saved products             │
│ items    │ product_id       │                            │
└──────────┴──────────────────┴────────────────────────────┘
```

### Key Design Decisions
- **`order_items` stores product snapshot** — name, price, image are copied at checkout so order history never breaks if product is updated/deleted
- **`specifications` is JSONB** — flexible key-value pairs for different product categories without schema changes
- **`carts` has UNIQUE(user_id)** — one cart per user, ensured at DB level
- **Cart uses `ON CONFLICT DO UPDATE`** — adding an item already in cart increases quantity atomically
- **Foreign key `ON DELETE CASCADE`** — removing a cart/order removes its items automatically
- **GIN index on product name** — fast full-text search across product catalog
- **`is_default` user** — assumption: default logged-in user, no auth required per spec

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS (Amazon design system) |
| HTTP Client | Axios |
| Notifications | React Toastify |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| DB Client | node-postgres (pg) |
| Auth (future) | JWT + bcryptjs |
| ID Generation | UUID v4 |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/amazon-clone.git
cd amazon-clone
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string:
# DATABASE_URL=postgresql://username:password@localhost:5432/amazon_clone
# PORT=5000
# FRONTEND_URL=http://localhost:3000

# Create database in PostgreSQL
psql -U postgres -c "CREATE DATABASE amazon_clone;"

# Start server (auto-creates schema on first run)
npm run dev

# In a separate terminal, seed the database
npm run seed
```

### 3. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env:
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

### 4. Open Browser
Visit **http://localhost:3000**

---

## 🌐 Deployment Guide

### Backend → Railway
1. Push code to GitHub
2. New project on [Railway](https://railway.app)
3. Add PostgreSQL service → copy `DATABASE_URL`
4. Deploy backend with env vars: `DATABASE_URL`, `NODE_ENV=production`, `FRONTEND_URL`
5. After deploy: run seed via Railway CLI: `railway run npm run seed`

### Frontend → Vercel
1. Import frontend repo on [Vercel](https://vercel.com)
2. Set environment variable: `REACT_APP_API_URL=https://your-backend.railway.app/api`
3. Deploy

---

## 📂 Project Structure

```
amazon-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # DB connection pool
│   │   │   └── schema.sql        # Full PostgreSQL schema
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── categoryController.js
│   │   │   └── wishlistController.js
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   └── misc.js
│   │   └── index.js              # Express server entry
│   ├── seeds/
│   │   └── seed.js               # 16 products, 8 categories
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Header.js     # Sticky nav with search, cart
        │   │   └── Footer.js     # Multi-column footer
        │   └── common/
        │       ├── ProductCard.js  # Reusable product grid card
        │       └── StarRating.js   # Star display component
        ├── context/
        │   └── CartContext.js    # Global cart state (React Context)
        ├── pages/
        │   ├── Home.js           # Landing page with hero + sections
        │   ├── ProductList.js    # Filterable product grid
        │   ├── ProductDetail.js  # Product detail + buybox
        │   ├── Cart.js           # Shopping cart
        │   ├── Checkout.js       # 3-step checkout flow
        │   ├── OrderConfirmation.js
        │   ├── OrderHistory.js
        │   └── Wishlist.js
        ├── utils/
        │   └── api.js            # Centralized Axios API client
        ├── styles/
        │   └── global.css        # Amazon design tokens + utilities
        ├── App.js                # React Router configuration
        └── index.js              # React entry point
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (search, filter, sort, paginate) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Single product with images + related |
| GET | `/api/categories` | All categories with counts |
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart/items` | Add item to cart |
| PATCH | `/api/cart/items/:id` | Update cart item quantity |
| DELETE | `/api/cart/items/:id` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |
| GET | `/api/orders` | Order history |
| GET | `/api/orders/:id` | Single order details |
| POST | `/api/orders` | Place new order |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist/toggle` | Add/remove from wishlist |
| GET | `/api/wishlist/check/:id` | Check if product is wishlisted |
| GET | `/api/health` | Health check |

---

## 📦 Sample Product Categories & Data

The database is seeded with **16 products** across **8 categories**:
- 📱 **Electronics** — iPhone 15 Pro Max, Samsung QLED TV, Sony WH-1000XM5, MacBook Air M3, Logitech MX Master 3S, OnePlus 12R
- 📚 **Books** — Atomic Habits, Psychology of Money
- 👕 **Clothing** — Amazon Essentials Polo, Levi's 511 Jeans
- 🏠 **Home & Kitchen** — Instant Pot, Dyson V15
- ⚽ **Sports** — Boldfit Gym Bag, Nivia Football
- 🎮 **Toys & Games** — LEGO Technic Bugatti
- 💄 **Beauty** — Minimalist Niacinamide Serum

---

## 💡 Key Implementation Decisions

1. **No authentication needed** — default user `john@example.com` (ID: `00000000-0000-0000-0000-000000000001`) is assumed logged in as per spec
2. **GST included** — 18% GST calculated on checkout, free shipping above ₹499
3. **Order numbers** follow Amazon's format: `408-XXXXXXX-XXXXXXX`
4. **Stock management** — stock decrements on order placement, validated before checkout
5. **Cart persistence** — stored in PostgreSQL, persists across sessions
6. **Image carousel** — built without external dependencies, pure CSS + state
7. **Price formatting** — Indian Rupee (₹) with `en-IN` locale throughout

---

## 🎨 UI Design Notes

The UI closely mirrors Amazon.in with:
- Exact color palette (`#131921` header, `#FF9900` orange, `#232F3E` nav)
- Amazon-style typography and spacing
- Sticky header with search, cart badge, navigation bar
- Product cards with discount badges, Prime indicators
- Buy box with quantity selector and Amazon-style buttons
- Breadcrumb navigation throughout

---

*Built for SDE Intern Fullstack Assignment — Amazon Clone*
