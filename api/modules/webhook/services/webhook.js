const { getAllModels } = require("../../../middlewares/loadModels");
const webhookManager = require('../manager/webhook');

const findOrCreateLead = async (phoneNumber) => {
  if (!phoneNumber) return null;
  const { Lead, Message } = await getAllModels(process.env.DB_TYPE);

  let lead = await Lead.findOne({ where: { phone: phoneNumber } });

  if (!lead) {
    lead = await Lead.create({
      phone: phoneNumber,
      status: 'New' // default status
    });
    console.log('New lead created:', lead.id);
  } else {
    console.log('Existing lead found:', lead.id);
  }

  return lead;
};

const saveIncomingMessage = async (leadId, textContent) => {
  if (!leadId || !textContent) return;
  const { Lead, Message } = await getAllModels(process.env.DB_TYPE);

  await Message.create({
    leadId: leadId,
    sender: 'lead', // incoming message from user
    type: 'text',
    content: textContent,
    timestamp: new Date()
  });

  console.log('Incoming message saved for lead:', leadId);
};

// Service to create a webhook message
const createWebhookMessage = async (messageData) => {
  try {
    const newMessage = await webhookManager.createMessage(messageData); // Call the manager to create a message
    return newMessage;
  } catch (error) {
    console.error('Error in service:', error);
    throw error;
  }
};

// Service to get messages by lead
const getMessagesByLead = async (leadId) => {
  try {
    const messages = await webhookManager.getMessagesByLead(leadId); // Call the manager to fetch messages
    return messages;
  } catch (error) {
    console.error('Error in service:', error);
    throw error;
  }
};

module.exports = {
    findOrCreateLead,
    saveIncomingMessage,
    createWebhookMessage,
    getMessagesByLead
  };
  