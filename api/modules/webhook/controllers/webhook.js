// modules/webhook/controllers/webhook.js

const webhookManager = require('../manager/webhook');

exports.handleIncomingMessage = async (req, res) => {
  try {
    console.log('Incoming WhatsApp Webhook:', JSON.stringify(req.body, null, 2));

    // Immediately respond
    res.sendStatus(200);

    // Background processing
    const messageData = req.body;
    await webhookManager.processIncomingMessage(messageData);

  } catch (error) {
    console.error('Error in webhook controller:', error);
    res.sendStatus(500);
  }
};
