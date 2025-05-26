const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data, userId) => {
  const { Reminders } = await getAllModels(process.env.DB_TYPE);

  const reminder = await Reminders.create({ ...data, user_id: userId });
  return { status: 201, data: reminder };
};

const findById = async (id) => {
  const { Reminders } = await getAllModels(process.env.DB_TYPE);

  const reminder = await Reminders.findByPk(id);
  return reminder ? { status: 200, data: reminder } : { status: 404, data: { message: 'Not found' } };
};

const findAllByUser = async (userId) => {
  const { Reminders } = await getAllModels(process.env.DB_TYPE);

  const reminderList = await Reminders.findAll({ where: { user_id: userId } });
  return { status: 200, data: reminderList };
};

const update = async (id, data) => {
  const { Reminders } = await getAllModels(process.env.DB_TYPE);

  const [updated] = await Reminders.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated' } } : { status: 404, data: { message: 'Not found' } };
};

const remove = async (id) => {
  const { Reminders } = await getAllModels(process.env.DB_TYPE);

  const deleted = await Reminders.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted' } } : { status: 404, data: { message: 'Not found' } };
};


module.exports = {
    create,
    findById,
    findAllByUser,
    update,
    remove
};
