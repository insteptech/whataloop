const whatsappService = require('../services/whatsapp');

exports.processIncoming = async (payload) => {
  return await whatsappService.handleIncomingMessage(payload);
};

exports.saveRawPayload = async (data) => {
  await whatsappService.createWhatsappEntry(data);
};

exports.handleIncomingPayload = async (payload) => {
  // You can later extract info like phone number, message etc. from payload
  await whatsappService.saveRawPayload(payload);
};

exports.sendMessage = async (phone, message) => {
  return await whatsappService.sendTextMessage(phone, message);
};

exports.generateLeadLink = async (user, message, campaign) => {
  // You can add any business logic or checks here
  return whatsappService.generateLeadLink(user, message, campaign);
};