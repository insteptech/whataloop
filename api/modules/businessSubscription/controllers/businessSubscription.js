const manager = require("../manager/businessSubscription");

exports.create = async (req, res) => {
  const result = await manager.create(req.body);
  res.status(result.status).json(result.data);
};

exports.findById = async (req, res) => {
  const result = await manager.findById(req.params.id);
  res.status(result.status).json(result.data);
};

exports.findByBusiness = async (req, res) => {
  const result = await manager.findByBusiness(req.params.business_id);
  res.status(result.status).json(result.data);
};

exports.update = async (req, res) => {
  const result = await manager.update(req.params.id, req.body);
  res.status(result.status).json(result.data);
};

exports.remove = async (req, res) => {
  const result = await manager.remove(req.params.id);
  res.status(result.status).json(result.data);
};

exports.updateStripeSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;
    const { planId, status } = req.body; // example: planId to switch plans, status to pause/cancel
    const result = await manager.updateStripeSubscription(subscriptionId, planId, status);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err); // error handler middleware
  }
};


exports.createUpgradeSession = async (req, res, next) => {
  try {
    const { planId, businessId, userId } = req.body;
    const session = await manager.createUpgradeSession({ planId, businessId, userId });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};