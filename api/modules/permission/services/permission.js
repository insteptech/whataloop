const { getAllModels } = require("../../../middlewares/loadModels");

exports.create = async (payload) => {
  const { Permission } = await getAllModels(process.env.DB_TYPE);
  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }
  let result = new Permission(payload);
  return await result.save();
};
