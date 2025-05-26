const manager = require('../manager/subscriptions');

// GET /api/v1/subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await manager.getAllSubscriptions();
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// GET /api/v1/subscriptions/:id
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await manager.getSubscriptionById(id);
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    res.status(200).json(subscription);
  } catch (err) {
    console.error('Error fetching subscription by ID:', err);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// POST /api/v1/subscriptions
exports.createOrUpdateSubscription = async (req, res) => {
  try {
    const subscription = await manager.createOrUpdateSubscription(req.body);
    res.status(200).json(subscription);
  } catch (err) {
    console.error('Error creating/updating subscription:', err);
    res.status(500).json({ error: 'Failed to create or update subscription' });
  }
};

// PUT /api/v1/subscriptions/:id
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await manager.updateSubscription(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating subscription:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/v1/subscriptions/:id
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await manager.cancelSubscription(id);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting subscription:', err.message);
    res.status(500).json({ error: err.message });
  }
};
