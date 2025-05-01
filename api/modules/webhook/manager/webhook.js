// modules/webhook/manager/webhook.js

const webhookService = require('../services/webhook');
const { WebhookMessage } = require('../models/webhook');


exports.processIncomingMessage = async (messageData) => {
  if (!messageData || !messageData.messages || !Array.isArray(messageData.messages)) {
    console.warn('Invalid webhook payload');
    return;
  }

  for (const msg of messageData.messages) {
    const phoneNumber = msg.from; // WhatsApp sender
    const textBody = msg.text?.body || '';

    // 1. Find or create Lead
    const lead = await webhookService.findOrCreateLead(phoneNumber);

    if (!lead) {
      console.error('Failed to find or create lead.');
      continue;
    }

    // 2. Save incoming message
    return await webhookService.saveIncomingMessage(lead.id, textBody);
  }
};


// Manager to handle business logic of webhook messages
exports.createMessage = async ({ leadId, content, sender, messageType }) => {
  const newMessage = await WebhookMessage.create({
    leadId,
    content,
    sender,
    messageType,
    sentAt: new Date(),
  });
  return newMessage;
};

exports.getMessagesByLead = async (leadId) => {
  const messages = await WebhookMessage.findAll({
    where: { leadId },
    order: [['sentAt', 'ASC']],
  });
  return messages;
};