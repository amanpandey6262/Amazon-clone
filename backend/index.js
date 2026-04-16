const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Setup nodemailer transporter using Ethereal (test email service)
let transporter;
(async () => {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log('Email transporter ready (Ethereal test account)');
})();

// Default user middleware
app.use(async (req, res, next) => {
  try {
    let user = await prisma.user.findUnique({ where: { email: 'default@amazonclone.abc' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Default User',
          email: 'default@amazonclone.abc',
          address: '123 MG Road, Bangalore, Karnataka 560001',
        }
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

// GET /api/categories — always returns full list
app.get('/api/categories', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let products = await prisma.product.findMany();

    // Case-insensitive search on title (SQLite contains is case-sensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => p.title.toLowerCase().includes(searchLower));
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cart
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { id: 'asc' }
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const existing = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId: parseInt(productId) }
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true }
      });
      return res.json(updated);
    }
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId: parseInt(productId),
        quantity
      },
      include: { product: true }
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart/:id
app.put('/api/cart/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
      return res.json({ message: 'Deleted' });
    }
    const updated = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: { quantity },
      include: { product: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders — place order + send email notification
app.post('/api/orders', async (req, res) => {
  try {
    const { address } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          address: address || req.user.address,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: { items: { include: { product: true } } }
      });

      await tx.cartItem.deleteMany({
        where: { userId: req.user.id }
      });

      return newOrder;
    });

    // Send email notification (non-blocking)
    if (transporter) {
      const itemsList = order.items.map(item =>
        `  - ${item.product.title} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const mailOptions = {
        from: '"Amazon Clone" <noreply@amazonclone.abc>',
        to: req.user.email,
        subject: `Order Confirmation - Order #${order.id}`,
        text: `Hello ${req.user.name},\n\nYour order has been placed successfully!\n\nOrder #${order.id}\nDate: ${new Date(order.createdAt).toLocaleString()}\n\nItems:\n${itemsList}\n\nTotal: ₹${order.totalAmount.toFixed(2)}\nShipping Address: ${order.address}\n\nThank you for shopping with us!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #232F3E; padding: 20px; text-align: center;">
              <h1 style="color: #FF9900; margin: 0;">Amazon Clone</h1>
            </div>
            <div style="padding: 20px; background-color: #fff;">
              <h2 style="color: #007600;">Order Placed Successfully!</h2>
              <p>Hello ${req.user.name},</p>
              <p>Your order <strong>#${order.id}</strong> has been confirmed.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f3f3f3;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
                </tr>
                ${order.items.map(item => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.product.title}</td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </table>
              <p style="font-size: 18px; font-weight: bold; color: #B12704;">Order Total: ₹${order.totalAmount.toFixed(2)}</p>
              <p><strong>Shipping Address:</strong> ${order.address}</p>
            </div>
            <div style="background-color: #f3f3f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>Thank you for shopping with Amazon Clone!</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(mailOptions).then(info => {
        console.log('Order confirmation email sent!');
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
      }).catch(err => {
        console.error('Email send error:', err);
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders — order history
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/wishlist — user's wishlist
app.get('/api/wishlist', async (req, res) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/wishlist — add to wishlist
app.post('/api/wishlist', async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: req.user.id, productId: parseInt(productId) }
    });
    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    const item = await prisma.wishlistItem.create({
      data: {
        userId: req.user.id,
        productId: parseInt(productId)
      },
      include: { product: true }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/wishlist/:id — remove from wishlist
app.delete('/api/wishlist/:id', async (req, res) => {
  try {
    await prisma.wishlistItem.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
