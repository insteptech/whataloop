const { getAllModels } = require("../../../middlewares/loadModels");

const getMessagesByLead = async (leadId) => {
  try {
    const { WebhookMessage } = await getAllModels(process.env.DB_TYPE);

    const messages = await WebhookMessage.getMessagesByLead(leadId); // Call the manager to fetch messages
    return messages;
  } catch (error) {
    console.error('Error in service:', error);
    throw error;
  }
};

const createWebhookMessage = async (data) => {
  try {
    const { WebhookMessage } = await getAllModels(process.env.DB_TYPE);
    if (!WebhookMessage) {
      throw new Error("WebhookMessage model not found");
    }

    const newWebhookMessage = await WebhookMessage.create(data);
    return newWebhookMessage;
  } catch (error) {
    console.error("Error in leadService.create:", error.message);
    throw error;
  }
};
const findAll = async (leadId, query) => {
  const { sort = 'createdAt', order = 'DESC', page = 1, limit = 10 } = query;
  const { WebhookMessage } = await getAllModels(process.env.DB_TYPE);

  if (!WebhookMessage) {
    throw new Error("WebhookMessage model not found");
  }

  const where = { leadId: leadId };

  return await WebhookMessage.findAndCountAll({
    where,
    order: [[sort, order.toUpperCase()]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });
};

module.exports = {
    createWebhookMessage,
    getMessagesByLead,
    findAll
  };
  