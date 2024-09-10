const express = require('express');
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
  getSellerOrders
} = require('../services/orderService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

router.get('/seller-orders', authService.allowedTo('seller'), getSellerOrders);


router.post(
  '/checkout-session/:cartId',
  authService.allowedTo('user'),
  checkoutSession
);

router.route('/:cartId').post(authService.allowedTo('user'), createCashOrder);


router.get(
  '/',
  authService.allowedTo('user', 'admin', 'seller'),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:id', findSpecificOrder);

router.put(
  '/:id/pay',
  authService.allowedTo('admin'),
  updateOrderToPaid
);
router.put(
  '/:id/deliver',
  authService.allowedTo('admin'),
  updateOrderToDelivered
);



module.exports = router;
