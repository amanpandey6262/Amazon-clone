# Amazon Clone Web Application

This project is a functional e-commerce web application that closely replicates Amazon's design and user experience. It features product browsing, search and filter, shopping cart, and order placement functionalities.

## Tech Stack
*   **Frontend**: React.js (via Vite React template), Vanilla CSS (strictly avoiding TailwindCSS per requirements), and React Router DOM.
*   **Backend**: Node.js and Express.js.
*   **Database**: SQLite via Prisma ORM for seamless local setup. (Schema is perfectly compatible with PostgreSQL/MySQL and provider can quickly be switched under `backend/prisma/schema.prisma` if desired).

## Core Features
1.  **Product Listing Page**: Grid layout mimicking Amazon, complete with thumbnails, title, price, stock, and Add to Cart button. Handled via Home Component.
2.  **Product Detail Page**: Displays detailed product details along with an image carousel thumbnail list. You can Add to Cart or execute a "Buy Now" flow directly.
3.  **Shopping Cart**: Quantity can be adjusted (`+`/`-`), items can be deleted, and dynamic subtotals are displayed.
4.  **Order Placement**: Faux checkout flow containing shipping location input, order summary, and order success confirmation complete with an Order ID.

## Assumptions
*   **Database Choice**: Used SQLite for the database engine to guarantee immediate "clone-and-run" portability for the local setup review. The `seed.js` script manages dummy Amazon products (Echo dot, iPads, etc.) seamlessly in `./dev.db`.
*   **Default Login System**: Emulated an automatic "Default User" middleware injected at the Express layer, which removes login requirements while still persisting relational user data for cart items and orders.
*   **UI Assets**: Pulled imagery straight from publicly available placeholder sites simulating Amazon products. Included the standard header with Amazon-styled buttons and fonts natively via CSS.

## Setup Instructions

### 1. Backend Setup
Navigate into the `backend` directory, install dependencies, prepare the SQLite database, and run the server.

\`\`\`bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
\`\`\`
The backend server runs on \`http://localhost:3001\`.

### 2. Frontend Setup
In a new terminal window, navigate into the `frontend` directory, install dependencies, and run the development server.

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend will run on \`http://localhost:5173\`. Open your web browser to view the application!

---
*Created natively with AI capabilities utilizing a precise design system adhering closely to Vanilla CSS rules.*
