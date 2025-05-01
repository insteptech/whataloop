const express = require("express");
const { handleIncomingMessage } = require('../controllers/webhook');
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();
const webhookController = require('../controllers/webhook');


// router.post('/message', handleIncomingMessage);
router.post('/message', webhookController.createWebhookMessage);
router.get('/messages/:leadId', webhookController.getMessagesByLead);

module.exports = router;