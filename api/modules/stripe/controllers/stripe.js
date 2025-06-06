const manager = require('../manager/stripe');

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { planId, businessId, userId, successUrl, cancelUrl } = req.body;
    const result = await manager.createCheckoutSession({ planId, businessId, userId, successUrl, cancelUrl });
    res.status(200).json({ url: result.url });
  } catch (err) {
    next(err); // uses your error handler middleware
  }
};

exports.stripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = await manager.handleStripeWebhook(req.body, sig);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Stripe Webhook] Error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};