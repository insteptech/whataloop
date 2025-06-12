const { getAllModels } = require('../../../middlewares/loadModels');
const { sendTextMessage } = require("../../whatsapp/services/whatsapp")

const createMessage = async (data) => {
  const { Message } = await getAllModels(process.env.DB_TYPE);
  if (!Message) throw new Error('Message model not found');
  await sendTextMessage(data.receiver_phone_number, data.message_content);
  return await Message.create(data);
};

const getMessagesByLead = async (lead_id) => {
  const { Message } = await getAllModels(process.env.DB_TYPE);
  if (!Message) throw new Error('Message model not found');
  return await Message.findAll({
    where: { lead_id },
    order: [['timestamp', 'ASC']],
  });
};

const getMessageById = async (id) => {
  const { Message } = await getAllModels(process.env.DB_TYPE);
  if (!Message) throw new Error('Message model not found');
  const message = await Message.findByPk(id);
  if (!message) throw new Error('Message not found');
  return message;
};


module.exports = {
  createMessage,
  getMessagesByLead,
  getMessageById,
};
