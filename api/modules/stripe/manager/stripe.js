const service = require('../services/stripe');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (payload) => {
  return service.createCheckoutSession(payload);
};

exports.handleStripeWebhook = async (body, signature) => {
  return service.handleStripeWebhook(body, signature);
};

exports.listInvoices = async ({ customer_id }) => {
  return await service.listInvoices(customer_id);
};

exports.getInvoicePdfUrl = async ({ invoice_id }) => {
  return await service.getInvoicePdfUrl(invoice_id);
};

exports.handleInvoiceDownload = async (sessionId) => {
  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  const invoiceUrl = await service.getInvoiceBySessionId(sessionId);
  return invoiceUrl;
};

// managers/stripeManager.js
exports.getInvoiceUrl = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const invoiceId = session.invoice;
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice.invoice_pdf; // this is the secure URL
};