const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getAllModels } = require("../../../middlewares/loadModels");

const createCheckoutSession = async ({ planId, businessId, userId, successUrl, cancelUrl }) => {
  const { SubscriptionPlan, User } = await getAllModels(process.env.DB_TYPE);

  if (!planId || !businessId || !userId) throw new Error('Missing required fields: planId, businessId, userId');
  if (!successUrl || !cancelUrl) throw new Error('Missing required fields: successUrl, cancelUrl');

  const plan = await SubscriptionPlan.findByPk(planId);
  if (!plan) throw new Error('Plan not found');
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.full_name,
      metadata: { userId: user.id }
    });
    customerId = customer.id;
    user.stripe_customer_id = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerId,
    line_items: [{
      price: plan.stripe_price_id,
      quantity: 1,
    }],
    metadata: {
      userId: user.id,
      businessId: businessId,
      planId: plan.id,
    },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${cancelUrl}?checkout_error=User canceled the checkout process.`,
  });

  return session;
};

const handleStripeWebhook = async (body, signature) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  // 1. Verify Stripe signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  // 2. Process supported events
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return true;
};

async function handleCheckoutSessionCompleted(session) {
  // Stripe session.metadata is set by you during session creation
  const { SubscriptionPlan, User, BusinessSubscription } = await getAllModels(process.env.DB_TYPE);

  const userId = session.metadata?.userId;
  const businessId = session.metadata?.businessId;
  const planId = session.metadata?.planId;
  const stripeSubscriptionId = session.subscription;

  // Update user
  const user = await User.findByPk(userId);
  const plan = await SubscriptionPlan.findByPk(planId);

  if (user && plan) {
    user.subscription_plan_id = plan.id;
    user.account_type = plan.name.toLowerCase();
    user.subscription_status = 'active';
    await user.save();
  }

  // Update or create business subscription
  let businessSub = await BusinessSubscription.findOne({
    where: { user_id: userId, business_id: businessId }
  });
  if (!businessSub) {
    await BusinessSubscription.create({
      business_id: businessId,
      user_id: userId,
      plan_id: planId,
      status: 'active',
      stripe_subscription_id: stripeSubscriptionId,
      start_date: new Date(session.created * 1000),
    });
  } else {
    businessSub.plan_id = planId;
    businessSub.status = 'active';
    businessSub.stripe_subscription_id = stripeSubscriptionId;
    await businessSub.save();
  }
}

async function handleSubscriptionUpdated(subscription) {
  // Find business subscription by Stripe sub ID
  const { SubscriptionPlan, User, BusinessSubscription } = await getAllModels(process.env.DB_TYPE);

  let businessSub = await BusinessSubscription.findOne({
    where: { stripe_subscription_id: subscription.id }
  });
  if (businessSub) {
    businessSub.status = subscription.status; // 'active', 'canceled', etc.
    businessSub.start_date = new Date(subscription.start_date * 1000);
    businessSub.end_date = subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : null;
    await businessSub.save();

    // Also update user status
    const user = await User.findByPk(businessSub.user_id);
    if (user) {
      user.subscription_status = subscription.status;
      user.subscription_plan_id = businessSub.plan_id;
      await user.save();
    }
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { SubscriptionPlan, User, BusinessSubscription } = await getAllModels(process.env.DB_TYPE);

  let businessSub = await BusinessSubscription.findOne({
    where: { stripe_subscription_id: subscription.id }
  });
  if (businessSub) {
    businessSub.status = 'canceled';
    businessSub.end_date = new Date();
    await businessSub.save();

    // Update user status as well
    const user = await User.findByPk(businessSub.user_id);
    if (user) {
      user.subscription_status = 'canceled';
      await user.save();
    }
  }
}

const listInvoices = async (customer_id) => {
  if (!customer_id) throw new Error('customer_id is required');
  const invoices = await stripe.invoices.list({ customer: customer_id, limit: 100 });
  return invoices.data.map(inv => ({
    id: inv.id,
    number: inv.number,
    amount_due: inv.amount_due,
    currency: inv.currency,
    status: inv.status,
    hosted_invoice_url: inv.hosted_invoice_url,
    invoice_pdf: inv.invoice_pdf,
    created: inv.created
  }));
};

const getInvoicePdfUrl = async (invoice_id) => {
  const invoice = await stripe.invoices.retrieve(invoice_id);
  if (!invoice.invoice_pdf) throw new Error('Invoice PDF not available');
  return invoice.invoice_pdf;
};

const getInvoiceBySessionId = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session || !session.subscription) {
    throw new Error('No subscription found in this session');
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  if (!subscription.latest_invoice) {
    throw new Error('No invoice associated with this subscription');
  }

  const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

  if (!invoice.invoice_pdf) {
    throw new Error('Invoice PDF not available yet');
  }

  return invoice.invoice_pdf; // Stripe-hosted download link
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  listInvoices,
  getInvoicePdfUrl,
  getInvoiceBySessionId
};
