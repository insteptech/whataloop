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

const createMessage = async ({ leadId, content, sender, messageType }) => {
  return await webhookManager.createMessage({ leadId, content, sender, messageType });
};

const getMessagesByLead = async (leadId) => {
  return await webhookManager.getMessagesByLead(leadId);
};

module.exports = {
    findOrCreateLead,
    saveIncomingMessage,
    createMessage,
    getMessagesByLead
  };
  