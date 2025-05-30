const messageManager = require('../manager/message');

exports.createMessage = async (req, res) => {
  try {
    const message = await messageManager.createMessage(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMessagesByLead = async (req, res) => {
  try {
    const messages = await messageManager.getMessagesByLead(req.params.lead_id);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await messageManager.getMessageById(req.params.id);
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
