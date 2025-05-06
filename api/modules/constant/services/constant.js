const { getAllModels } = require("../../../middlewares/loadModels");
const { Op } = require('sequelize');

const getConstantType = async (query) => {
  const { Constant } = await getAllModels(process.env.DB_TYPE);

  const where = {};
  if (query.type) where.type = query.type;

  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.limit) || 10;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const { count, rows } = await Constant.findAndCountAll({
    where,
    attributes: ['id', 'type', 'label'],
    offset,
    limit,
  });

  if (!rows || rows.length === 0) {
    throw { message: "Constant type not found" };
  }

  return {
    count,
    rows,
    currentPage: page,
    totalPages: Math.ceil(count / pageSize),
  };
};

const createConstant = async (data) => {
  try {
    const { Constant } = await getAllModels(process.env.DB_TYPE);

    const newConstant = await Constant.create(data);
    return newConstant;
  } catch (error) {
    throw new Error('Error while creating constant: ' + error.message);
  }
};



module.exports = {
  getConstantType,
  createConstant
}