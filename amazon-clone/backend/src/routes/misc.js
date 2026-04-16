const express = require('express');
const catRouter = express.Router();
const wishRouter = express.Router();
const { getCategories } = require('../controllers/categoryController');
const { getWishlist, toggleWishlist, checkWishlist } = require('../controllers/wishlistController');

catRouter.get('/', getCategories);

wishRouter.get('/', getWishlist);
wishRouter.post('/toggle', toggleWishlist);
wishRouter.get('/check/:productId', checkWishlist);

module.exports = { catRouter, wishRouter };
