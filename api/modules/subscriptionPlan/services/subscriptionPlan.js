const { getAllModels } = require("../../../middlewares/loadModels");
const stripe = require('../../../utils/stripe');

const createStripeProductAndPrice = async (plan) => {
  const productData = {
    name: plan.name,
  };

  if (plan.description && plan.description.trim() !== '') {
    productData.description = plan.description.trim();
  }

  const product = await stripe.products.create(productData);

  const price = await stripe.prices.create({
    unit_amount: Math.round(plan.price * 100),
    currency: 'inr',
    recurring: { interval: 'month' },
    product: product.id,
  });

  return { productId: product.id, priceId: price.id };
};


const create = async (data) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);

  if (!SubscriptionPlan) {
    throw new Error("SubscriptionPlan model not found");
  }

  // Step 1: Check for existing plan (by name and price as example)
  const existingPlan = await SubscriptionPlan.findOne({
    where: {
      name: data.name,
      price: data.price,
    },
  });

  if (existingPlan) {
    return {
      status: 409,
      message: "Subscription plan already exists",
      data: existingPlan,
    };
  }

  // Step 2: Create the plan in DB
  const plan = await SubscriptionPlan.create(data);

  // Step 3: Sync with Stripe
  try {
    const { productId, priceId } = await createStripeProductAndPrice(plan);
    plan.stripe_product_id = productId;
    plan.stripe_price_id = priceId;
    await plan.save();
  } catch (err) {
    console.error('Error syncing with Stripe:', err);
    // Optional: Mark status for manual sync retry
  }

  return { status: 201, data: plan };
};


const findById = async (id) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const plan = await SubscriptionPlan.findByPk(id);
  return plan
    ? { status: 200, data: plan }
    : { status: 404, data: { message: 'Plan not found' } };
};

const findAll = async () => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const plans = await SubscriptionPlan.findAll();
  return { status: 200, data: plans };
};

const update = async (id, data) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await SubscriptionPlan.update(data, { where: { id } });
  return updated
    ? { status: 200, data: { message: 'Updated successfully' } }
    : { status: 404, data: { message: 'Plan not found' } };
};

const remove = async (id) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const deleted = await SubscriptionPlan.destroy({ where: { id } });
  return deleted
    ? { status: 200, data: { message: 'Deleted successfully' } }
    : { status: 404, data: { message: 'Plan not found' } };
};

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove,
};
