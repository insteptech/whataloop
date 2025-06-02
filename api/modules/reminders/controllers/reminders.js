const reminderManager = require('../manager/reminders');
const { getUserIdFromToken } = require('../../../utils/helper');

exports.createReminder = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);
  const result = await reminderManager.createReminder(req.body, userId);
  res.status(result.status).json(result.data);
};

exports.getReminderById = async (req, res) => {
  const result = await reminderManager.getReminderById(req.params.id);
  res.status(result.status).json(result.data);
};

exports.getReminders = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);
  if(!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const result = await reminderManager.getReminders(userId);
  res.status(result.status).json(result.data);
};

exports.updateReminder = async (req, res) => {
  const result = await reminderManager.updateReminder(req.params.id, req.body);
  res.status(result.status).json(result.data);
};

exports.deleteReminder = async (req, res) => {
  const result = await reminderManager.deleteReminder(req.params.id);
  res.status(result.status).json(result.data);
};
