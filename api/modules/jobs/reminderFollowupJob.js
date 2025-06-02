// jobs/reminderFollowupJob.js

const cron = require('node-cron');
const { Op } = require('sequelize');
const { getAllModels } = require('../../middlewares/loadModels');

const checkWaitForReplyReminders = async () => {
  const { Reminder, Message, Lead, User } = await getAllModels(process.env.DB_TYPE);
  const now = new Date();

  // Fetch all pending "wait_for_reply" reminders that are due
  const reminders = await Reminder.findAll({
    where: {
      status: 'pending',
      type: 'wait_for_reply',
      remind_at: { [Op.lte]: now },
    }
  });

  for (const reminder of reminders) {
    // Get user and lead info
    const user = await User.findOne({ where: { id: reminder.user_id } });
    const lead = await Lead.findOne({ where: { id: reminder.lead_id } });
    if (!user || !lead) continue;

    // Find last outgoing message sent by the user to this lead
    const lastOutgoingMsg = await Message.findOne({
      where: {
        lead_id: reminder.lead_id,
        sender_phone_number: user.phone, // Make sure 'phone' exists on User model
        message_type: 'outgoing',
      },
      order: [['timestamp', 'DESC']],
    });

    const afterTime = lastOutgoingMsg ? lastOutgoingMsg.timestamp : null;

    // Check if any incoming message exists from the lead after last outgoing message and before remind_at
    const replyMsg = await Message.findOne({
      where: {
        lead_id: reminder.lead_id,
        sender_phone_number: lead.phone, // Make sure 'phone' exists on Lead model
        message_type: 'incoming',
        ...(afterTime && { timestamp: { [Op.gte]: afterTime } }),
        timestamp: { [Op.lte]: reminder.remind_at }
      }
    });

    if (!replyMsg) {
      // No reply received: mark reminder as 'due' and trigger notification (customize as needed)
      reminder.status = 'due'; // You can also keep it 'pending' and only trigger notification
      await reminder.save();

      // TODO: Trigger notification logic (websocket, email, or in-app notification)
      console.log(`Reminder due for lead ${lead.id}, user ${user.id}`);
    } else {
      // Lead replied: mark reminder as done
      reminder.status = 'done';
      await reminder.save();
      console.log(`Reminder completed (lead replied) for lead ${lead.id}, user ${user.id}`);
    }
  }
};

const startReminderFollowupJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log("Running wait-for-reply reminder job...");
    try {
      await checkWaitForReplyReminders();
    } catch (e) {
      console.error('Reminder followup job error:', e);
    }
  });
};

module.exports = startReminderFollowupJob;
