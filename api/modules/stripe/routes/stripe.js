const express = require('express');
const router = express.Router();
const controller = require('../controllers/stripe');

// This route gets express.raw (needed for Stripe verification)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  controller.stripeWebhook
);

// All other POST routes get express.json
router.post(
  '/checkout-session',
  express.json(),
  controller.createCheckoutSession
);
module.exports = router;
