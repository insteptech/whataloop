const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data, userId) => {
    const { Reply } = await getAllModels(process.env.DB_TYPE);

  const reply = await Reply.create({ ...data, user_id: userId });
  return { status: 201, data: reply };
};

const findById = async (id) => {
      const { Reply } = await getAllModels(process.env.DB_TYPE);

  const reply = await Reply.findByPk(id);
  return reply ? { status: 200, data: reply } : { status: 404, data: { message: 'Reply not found' } };
};

const findAllByUser = async (userId) => {
      const { Reply } = await getAllModels(process.env.DB_TYPE);

  const replyList = await Reply.findAll({ where: { user_id: userId } });
  return { status: 200, data: replyList };
};

const update = async (id, data) => {
      const { Reply } = await getAllModels(process.env.DB_TYPE);

  const [updated] = await Reply.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated successfully' } } : { status: 404, data: { message: 'Reply not found' } };
};

const remove = async (id) => {
      const { Reply } = await getAllModels(process.env.DB_TYPE);

  const deleted = await Reply.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted successfully' } } : { status: 404, data: { message: 'Reply not found' } };
};

module.exports = {
    create,
    findById,
    findAllByUser,
    update,
    remove
};
