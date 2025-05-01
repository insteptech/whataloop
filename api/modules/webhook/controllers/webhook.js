// modules/webhook/controllers/webhook.js

const webhookManager = require('../manager/webhook');
const webhookService = require('../services/webhook');

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

// Controller to handle incoming webhook requests and create messages
exports.createWebhookMessage = async (req, res) => {
  try {
    const { leadId, content, sender, messageType } = req.body;
    const newMessage = await webhookService.createMessage({ leadId, content, sender, messageType });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing webhook message.' });
  }
};

// Controller to fetch all messages for a particular lead
exports.getMessagesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const messages = await webhookService.getMessagesByLead(leadId);
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving webhook messages.' });
  }
};