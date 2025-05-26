const { getAllModels } = require("../../../middlewares/loadModels");

const { Op } = require("sequelize");


// Create or update a subscription (upsert)
const createOrUpdateSubscription = async (data) => {
  const { Subscriptions } = await getAllModels(process.env.DB_TYPE);

  const [subscription] = await Subscriptions.upsert(data, { returning: true });
  return subscription;
};

// Get all subscriptions (optionally with filters, extend as needed)
const getAllSubscriptions = async () => {
  const { Subscriptions } = await getAllModels(process.env.DB_TYPE);

  return await Subscriptions.findAll({
    order: [['created_at', 'DESC']],
  });
};

// Get a subscription by ID
const getSubscriptionById = async (id) => {
  const { Subscriptions } = await getAllModels(process.env.DB_TYPE);

  return await Subscriptions.findByPk(id);
};

// Update a subscription
const updateSubscription = async (id, updateData) => {
  const { Subscriptions } = await getAllModels(process.env.DB_TYPE);

  const subscription = await Subscriptions.findByPk(id);
  if (!subscription) throw new Error('Subscriptions not found');

  await subscription.update(updateData);
  return subscription;
};

// Delete/cancel a subscription
const cancelSubscription = async (id) => {
  const { Subscriptions } = await getAllModels(process.env.DB_TYPE);

  const subscription = await Subscriptions.findByPk(id);
  if (!subscription) throw new Error('Subscriptions not found');

  await subscription.destroy();
  return { message: 'Subscriptions cancelled successfully' };
};


module.exports = {
  createOrUpdateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription
};
