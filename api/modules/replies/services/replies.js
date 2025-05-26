const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data, userId) => {
    const { Replies } = await getAllModels(process.env.DB_TYPE);

  const reply = await Replies.create({ ...data, user_id: userId });
  return { status: 201, data: reply };
};

const findById = async (id) => {
      const { Replies } = await getAllModels(process.env.DB_TYPE);

  const reply = await Replies.findByPk(id);
  return reply ? { status: 200, data: reply } : { status: 404, data: { message: 'Reply not found' } };
};

const findAllByUser = async (userId) => {
      const { Replies } = await getAllModels(process.env.DB_TYPE);

  const replyList = await Replies.findAll({ where: { user_id: userId } });
  return { status: 200, data: replyList };
};

const update = async (id, data) => {
      const { Replies } = await getAllModels(process.env.DB_TYPE);

  const [updated] = await Replies.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated successfully' } } : { status: 404, data: { message: 'Reply not found' } };
};

const remove = async (id) => {
      const { Replies } = await getAllModels(process.env.DB_TYPE);

  const deleted = await Replies.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted successfully' } } : { status: 404, data: { message: 'Reply not found' } };
};

module.exports = {
    create,
    findById,
    findAllByUser,
    update,
    remove
};
