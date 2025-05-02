const webhookService = require('../services/webhook');
const { getAllModels } = require("../../../middlewares/loadModels");
const {
  sendResponse,
} = require("../utils/helper.js");

exports.createWebhookMessage = async (req, res) => {
  const { leadId, content, sender, messageType } = req.body;

  // If no existing user found, proceed with signup
  user = await webhookService.createWebhookMessage({
    leadId, content, sender, messageType
  });

  return sendResponse(res, 200, true, "User successfully created", {});
};

exports.getMessagesByLead = async (req, res) => {
  const { leadId } = req.body;
  if (!leadId) throw new Error("Lead ID is required");

  return await webhookService.findAll(leadId, req.query);
};