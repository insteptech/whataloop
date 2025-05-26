const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (data) => {
  const { ThirdPartyIntegration } = await getAllModels(process.env.DB_TYPE);
  
  if (ThirdPartyIntegration === undefined) {
    throw new Error("ThirdPartyIntegration model not found");
  }
  const integration = await ThirdPartyIntegration.create(data);
  return { status: 201, data: integration };
};

const findById = async (id) => {
  const { ThirdPartyIntegration } = await getAllModels(process.env.DB_TYPE);
  const integration = await ThirdPartyIntegration.findByPk(id);
  return integration
    ? { status: 200, data: integration }
    : { status: 404, data: { message: 'Integration not found' } };
};

const findByBusiness = async (businessId) => {
  const { ThirdPartyIntegration } = await getAllModels(process.env.DB_TYPE);
  const list = await ThirdPartyIntegration.findAll({ where: { business_id: businessId } });
  return { status: 200, data: list };
};

const update = async (id, data) => {
  const { ThirdPartyIntegration } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await ThirdPartyIntegration.update(data, { where: { id } });
  return updated
    ? { status: 200, data: { message: 'Updated successfully' } }
    : { status: 404, data: { message: 'Integration not found' } };
};

const remove = async (id) => {
  const { ThirdPartyIntegration } = await getAllModels(process.env.DB_TYPE);
  const deleted = await ThirdPartyIntegration.destroy({ where: { id } });
  return deleted
    ? { status: 200, data: { message: 'Deleted successfully' } }
    : { status: 404, data: { message: 'Integration not found' } };
};

module.exports = {
  create,
  findById,
  findByBusiness,
  update,
  remove
};
