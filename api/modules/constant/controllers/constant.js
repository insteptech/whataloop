// Content for constant.js
const {buildSchema} = require("../../../middlewares/joiValidation");
const constantManager = require("../manager/constant");
const CustomError = require("../../../middlewares/customError");
const { supportedDbTypes } = require("../../../utils/staticData");

exports.getConstantType = async (req, res, next) => {
    try{       
        const result = await constantManager.getConstantType(req, res, next);
        return result;
        
    } catch(error) {
        return next(new CustomError(error.message, 500));
    }
}