// Content for constant.js
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
  
  

module.exports = {
    getConstantType
}