const express = require('express');

const authService = require('../services/authService');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
  clearWishlist
} = require('../services/wishlistService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

// New route for clearing wishlist
router.put('/clear', clearWishlist);

module.exports = router;
