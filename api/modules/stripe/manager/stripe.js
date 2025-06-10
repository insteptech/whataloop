const service = require('../services/stripe');

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