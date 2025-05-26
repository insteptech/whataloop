const reminderService = require('../services/reminders');

exports.createReminder = async (data, userId) => {
  return await reminderService.create(data, userId);
};

exports.getReminderById = async (id) => {
  return await reminderService.findById(id);
};

exports.getReminders = async (userId) => {
  return await reminderService.findAllByUser(userId);
};

exports.updateReminder = async (id, data) => {
  return await reminderService.update(id, data);
};

exports.deleteReminder = async (id) => {
  return await reminderService.remove(id);
};
