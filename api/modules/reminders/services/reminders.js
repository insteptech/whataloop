const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data, userId) => {
  const { Reminder, Message, User } = await getAllModels(process.env.DB_TYPE);

  let remindAt = data.remind_at;

  // If reminder is wait_for_reply, auto-calculate remind_at from last outgoing message or now
  if (data.type === 'wait_for_reply' && data.wait_duration_minutes) {
    let userPhone = data.user_phone_number;

    // If user_phone_number not sent from frontend, get from User table
    if (!userPhone) {
      const user = await User.findOne({ where: { id: userId } });
      userPhone = user ? user.phone : null;
    }

    // Get latest outgoing message to this lead
    const lastOutgoingMsg = await Message.findOne({
      where: {
        lead_id: data.lead_id,
        sender_phone_number: userPhone,
        message_type: 'outgoing',
      },
      order: [['timestamp', 'DESC']],
    });

    const baseTime = lastOutgoingMsg ? lastOutgoingMsg.timestamp : new Date();
    remindAt = new Date(baseTime.getTime() + data.wait_duration_minutes * 60000);
  }

  const reminder = await Reminder.create({
    ...data,
    user_id: userId,
    remind_at: remindAt,
  });

  return { status: 201, data: reminder };
};

const findById = async (id) => {
  const { Reminder } = await getAllModels(process.env.DB_TYPE);

  const reminder = await Reminder.findByPk(id);
  return reminder ? { status: 200, data: reminder } : { status: 404, data: { message: 'Not found' } };
};

const findAllByUser = async (userId) => {
  const { Reminder } = await getAllModels(process.env.DB_TYPE);

  const reminderList = await Reminder.findAll({ where: { user_id: userId } });
  return { status: 200, data: reminderList };
};

const update = async (id, data) => {
  const { Reminder } = await getAllModels(process.env.DB_TYPE);

  const [updated] = await Reminder.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated' } } : { status: 404, data: { message: 'Not found' } };
};

const remove = async (id) => {
  const { Reminder } = await getAllModels(process.env.DB_TYPE);

  const deleted = await Reminder.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted' } } : { status: 404, data: { message: 'Not found' } };
};

module.exports = {
  create,
  findById,
  findAllByUser,
  update,
  remove
};
