// modules/webhook/manager/webhook.js

const webhookService = require('../services/webhook');
// const WebhookMessage = require('../models/webhook');
const { getAllModels } = require("../../../middlewares/loadModels");

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


exports.createMessage = async ({ leadId, content, sender, messageType }) => {
  try {
    // Ensure the model is defined correctly
    const { WebhookMessage } = await getAllModels(process.env.DB_TYPE);
    if (!WebhookMessage) {
      throw new Error('WebhookMessage model is not loaded correctly');
    }

    const newMessage = await WebhookMessage.create({
      leadId,
      content,
      sender,
      messageType,
      sentAt: new Date(),
    });

    return newMessage;
  } catch (error) {
    console.error('Error creating message in manager:', error);
    throw new Error('Error creating webhook message');
  }
};
exports.getMessagesByLead = async (leadId) => {
  try {
    const messages = await WebhookMessage.findAll({
      where: { leadId },
      order: [['sentAt', 'ASC']],
    });
    return messages; // Return the messages for the lead
  } catch (error) {
    console.error('Error fetching messages in manager:', error);
    throw new Error('Error retrieving messages');
  }
};