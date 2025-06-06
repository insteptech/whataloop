const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
  // Validate signature
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  // Event types you want to handle
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

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
};
