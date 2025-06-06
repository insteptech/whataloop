const express = require('express');
const router = express.Router();
const controller = require('../controllers/stripe');

router.post('/checkout-session', controller.createCheckoutSession);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),  // <-- this is crucial!
  controller.stripeWebhook
);

module.exports = router;
