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

exports.createWebhookMessage = async (req, res) => {
  try {
    const { leadId, content, sender, messageType } = req.body;
    
    const newMessage = await webhookService.createWebhookMessage({ leadId, content, sender, messageType });
    
    res.status(201).json({
      message: 'Webhook message created successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Error processing webhook message.' });
  }
};

exports.getMessagesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const messages = await webhookService.getMessagesByLead(leadId);
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Error retrieving webhook messages.' });
  }
};