const express = require("express");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();
const webhookController = require('../controllers/webhook');


router.post('/message', webhookController.createWebhookMessage);
router.get('/messages', authenticate, webhookController.getMessagesByLead);


module.exports = router;