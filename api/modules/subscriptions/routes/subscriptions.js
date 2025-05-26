const router = require('express').Router();
const controller = require('../controllers/subscriptions');

// Get all subscriptions (optionally filtered by user, if needed)
router.get('/', controller.getAllSubscriptions);

// Get a single subscription by ID
router.get('/:id', controller.getSubscriptionById);

// Create or update a subscription
router.post('/', controller.createOrUpdateSubscription);

// Update a subscription by ID
router.put('/:id', controller.updateSubscription);

// Cancel (delete) a subscription by ID
router.delete('/:id', controller.cancelSubscription);

module.exports = router;
