const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  if (Business === undefined) {
    throw new Error("Business model not found. Please check your database configuration.");
  }
  if (!data.user_id || !data.name) {
    throw new Error("Missing required fields: user_id and name are required.");
  }
  const business = await Business.create(data);
  return { status: 201, data: business };
};

const findById = async (id) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const business = await Business.findByPk(id);
  return business ? { status: 200, data: business } : { status: 404, data: { message: 'Business not found' } };
};

const findAll = async () => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const businesses = await Business.findAll();
  return { status: 200, data: businesses };
};

const update = async (id, data) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await Business.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated successfully' } } : { status: 404, data: { message: 'Business not found' } };
};

const remove = async (id) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const deleted = await Business.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted successfully' } } : { status: 404, data: { message: 'Business not found' } };
};

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove
};
