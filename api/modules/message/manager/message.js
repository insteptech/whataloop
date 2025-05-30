const messageService = require('../services/message');

exports.createMessage = async (data) => {
  // validation can go here if needed
  return await messageService.createMessage(data);
};

exports.getMessagesByLead = async (lead_id) => {
  return await messageService.getMessagesByLead(lead_id);
};

exports.getMessageById = async (id) => {
  return await messageService.getMessageById(id);
};
