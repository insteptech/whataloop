const service = require('../services/subscriptions');

exports.getAllSubscriptions = async () => {
  return await service.getAllSubscriptions();
};

exports.getSubscriptionById = async (id) => {
  return await service.getSubscriptionById(id);
};

exports.createOrUpdateSubscription = async (payload) => {
  return await service.createOrUpdateSubscription(payload);
};

exports.updateSubscription = async (id, updates) => {
  return await service.updateSubscription(id, updates);
};

exports.cancelSubscription = async (id) => {
  return await service.cancelSubscription(id);
};
