const constantService = require("../services/constant");
const { sendResponse } = require("../../../utils/helper");

exports.getConstantType = async (req, res) => {
    try {
      const constantType = await constantService.getConstantType(req.query);
      return sendResponse(
        res,
        200,
        true,
        "Constant Type fetched successfully",
        { constantType }
      );
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  };
  

exports.createConstant = async (data) => {
  try {
    const createdConstant = await constantService.createConstant(data);
    return createdConstant;
  } catch (error) {
    throw new Error('Manager error: ' + error.message);
  }
};

exports.deleteConstant = async (id) => {
  try {
    const deletedConstant = await constantService.deleteConstant(id);
    return deletedConstant;
  } catch (error) {
    throw new Error('Manager error: ' + error.message);
  }
};
