const express = require('express');
const Wishlist = require('../controllers/wishlistController');

const router = express.Router();

// Define CRUD routes
router.post('/create', Wishlist.createWishlist);
router.delete('/:id', Wishlist.deleteWishlist);
router.post('/getall', Wishlist.getWishlist);
router.post('/:id', Wishlist.getWishlistById);

module.exports = router;
