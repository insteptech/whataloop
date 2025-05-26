const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminders');

router.post('/', reminderController.createReminder);
router.get('/:id', reminderController.getReminderById);
router.get('/', reminderController.getReminders);
router.put('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
