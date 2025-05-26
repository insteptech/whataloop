const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  
  if (SubscriptionPlan === undefined) {
    throw new Error("SubscriptionPlan model not found");
  }
  const plan = await SubscriptionPlan.create(data);
  return { status: 201, data: plan };
};

const findById = async (id) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const plan = await SubscriptionPlan.findByPk(id);
  return plan ? { status: 200, data: plan } : { status: 404, data: { message: 'Plan not found' } };
};

const findAll = async () => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const plans = await SubscriptionPlan.findAll();
  return { status: 200, data: plans };
};

const update = async (id, data) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await SubscriptionPlan.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated successfully' } } : { status: 404, data: { message: 'Plan not found' } };
};

const remove = async (id) => {
  const { SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  const deleted = await SubscriptionPlan.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted successfully' } } : { status: 404, data: { message: 'Plan not found' } };
};

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove,
};
