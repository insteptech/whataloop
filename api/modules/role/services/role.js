const { getAllModels } = require("../../../middlewares/loadModels");

exports.createRole = async (payload) => {
  const { Role } = await getAllModels(process.env.DB_TYPE);
  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw { success: false, message: "Invalid request parameters" };
  }
  let result = new Role(payload);
  return await result.save();
};
