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

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body; // This is now a Buffer

  try {
    await manager.handleStripeWebhook(rawBody, sig); // pass Buffer, not parsed object!
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Stripe Webhook] Error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

exports.listInvoices = async (req, res) => {
  try {
    console.log('req;---', req.query);
    
    const { customer_id } = req.query;
    const invoices = await manager.listInvoices({ customer_id });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.downloadInvoicePdf = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const pdfUrl = await manager.getInvoicePdfUrl({ invoice_id });
    // Option 1: Redirect to Stripe PDF URL
    return res.redirect(pdfUrl);
    // Option 2: Stream PDF (if you want, can add)
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: 'Missing session_id in query' });
    }

    const invoiceUrl = await manager.handleInvoiceDownload(session_id);

    // Redirect to the Stripe-hosted invoice PDF
    return res.redirect(invoiceUrl);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return res.status(500).json({ message: error.message || 'Failed to download invoice' });
  }
};