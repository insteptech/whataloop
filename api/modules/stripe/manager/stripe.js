const service = require('../services/stripe');

exports.createCheckoutSession = async (payload) => {
  // Any pre-checks or manager-level business logic (e.g., feature flags) go here
  return service.createCheckoutSession(payload);
};

exports.handleStripeWebhook = async (body, signature) => {
  return service.handleStripeWebhook(body, signature);
};