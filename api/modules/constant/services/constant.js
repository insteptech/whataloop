const { getAllModels } = require("../../../middlewares/loadModels");
const { Op } = require('sequelize');

const getConstantType = async (query) => {
    const { Constant } = await getAllModels(process.env.DB_TYPE);
  
    const where = {};
    if (query.type) where.type = query.type; // 'tag', 'status', or 'source'
  
    const constantType = await Constant.findAll({
      where,
      attributes: ['id', 'type', 'label'],
    });
  
    if (!constantType || constantType.length === 0) {
      throw { message: "Constant type not found" };
    }
  
    return constantType;
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