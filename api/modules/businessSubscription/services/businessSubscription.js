const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data) => {
  const { BusinessSubscription, SubscriptionPlan } = await getAllModels(process.env.DB_TYPE);
  
  if (BusinessSubscription === undefined) {
    throw new Error("BusinessSubscription model not found");
  }
  if (!data.plan_id || !data.start_date) {
    throw new Error("Missing required fields: plan_id, start_date");
  }

  const planId = data.plan_id;
  const validPlan = await SubscriptionPlan.findOne({
    where: { id: planId }
  });
  if (!validPlan) {
    throw new Error("Invalid plan_id: Plan does not exist");
  }
  
  const result = await BusinessSubscription.create(data);
  return { status: 201, data: result };
};

const findById = async (id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const result = await BusinessSubscription.findByPk(id);
  return result
    ? { status: 200, data: result }
    : { status: 404, data: { message: "Not found" } };
};

const findByBusiness = async (business_id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const results = await BusinessSubscription.findAll({ where: { business_id } });
  return { status: 200, data: results };
};

const update = async (id, data) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await BusinessSubscription.update(data, { where: { id } });
  return updated
    ? { status: 200, data: { message: "Updated successfully" } }
    : { status: 404, data: { message: "Not found" } };
};

const remove = async (id) => {
  const { BusinessSubscription } = await getAllModels(process.env.DB_TYPE);
  const deleted = await BusinessSubscription.destroy({ where: { id } });
  return deleted
    ? { status: 200, data: { message: "Deleted successfully" } }
    : { status: 404, data: { message: "Not found" } };
};

module.exports = {
  create,
  findById,
  findByBusiness,
  update,
  remove,
};
