const { getAllModels } = require("../../../middlewares/loadModels");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const create = async (data) => {
  const { BusinessSubscription, SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  
  if (BusinessSubscription === undefined) {
    throw new Error("BusinessSubscription model not found");
  }
  if (!data.plan_id || !data.start_date) {
    throw new Error("Missing required fields: plan_id, start_date");
  }

  const planId = data.plan_id;
  const validPlan = await SubscriptionPlan.findOne({
    where: { id: planId }
  });
  if (!validPlan) {
    throw new Error("Invalid plan_id: Plan does not exist");
  }
  
  const result = await BusinessSubscription.create(data);
  return { status: 201, data: result };
};

const findById = async (id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const result = await BusinessSubscription.findByPk(id);
  return result
    ? { status: 200, data: result }
    : { status: 404, data: { message: "Not found" } };
};

const findByBusiness = async (business_id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const results = await BusinessSubscription.findAll({ where: { business_id } });
  return { status: 200, data: results };
};

const update = async (id, data) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await BusinessSubscription.update(data, { where: { id } });
  return updated
    ? { status: 200, data: { message: "Updated successfully" } }
    : { status: 404, data: { message: "Not found" } };
};

const remove = async (id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const deleted = await BusinessSubscription.destroy({ where: { id } });
  return deleted
    ? { status: 200, data: { message: "Deleted successfully" } }
    : { status: 404, data: { message: "Not found" } };
};

const updateStripeSubscription = async (subscriptionId, planId, status) => {
  const { BusinessSubscription, SubscriptionPlan, User } = await getAllModels(process.env.DB_TYPE);

  // Fetch the local business subscription
  const businessSub = await BusinessSubscription.findByPk(subscriptionId);
  if (!businessSub) throw new Error('Subscription not found');

  // Fetch user associated with this subscription (assumes user_id on BusinessSubscription)
  const user = await User.findByPk(businessSub.user_id);
  if (!user) throw new Error('User not found');

  // Prepare Stripe update object
  let stripeUpdate = {};
  let accountType = user.account_type; // fallback if no change

  if (planId) {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) throw new Error('Plan not found');
    stripeUpdate.items = [{
      id: businessSub.stripe_subscription_item_id,
      price: plan.stripe_price_id,
    }];
    // Map plan.name or plan.id to account_type (you may use plan.name or add a field for mapping)
    if (plan.name.toLowerCase().includes('starter')) accountType = 'starter';
    else if (plan.name.toLowerCase().includes('pro')) accountType = 'pro';
    else accountType = 'free';
  }

  if (status) {
    stripeUpdate.status = status;
  }

  // Update on Stripe
  const stripeSubscription = await stripe.subscriptions.update(
    businessSub.stripe_subscription_id,
    stripeUpdate
  );

  // Update local DB
  if (planId) {
    businessSub.plan_id = planId;
    user.subscription_plan_id = planId;
    user.account_type = accountType; // <-- update account_type
  }
  if (status) {
    businessSub.subscription_status = status;
    user.subscription_status = status;
  }

  await businessSub.save();
  await user.save();

  return stripeSubscription;
};

const createUpgradeSession = async ({ planId, businessId, userId }) => {
  const { BusinessSubscription, SubscriptionPlan, User } = await getAllModels(process.env.DB_TYPE);
  if (!planId || !businessId || !userId) {
    throw new Error('Missing required fields: planId, businessId, userId');
  }
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
    success_url: process.env.FRONTEND_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: process.env.FRONTEND_URL + '/cancel',
  });

  return session;
};

module.exports = {
  create,
  findById,
  findByBusiness,
  update,
  remove,
  updateStripeSubscription,
  createUpgradeSession
};
