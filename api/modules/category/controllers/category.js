// Content for category.js
const {
  createInput,
  updateInput,
  getCategoryInput,
} = require("../validations/category");
const { buildSchema } = require("../../../middlewares/joiValidation");
const categoryManager = require("../manager/category");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");

exports.createCategory = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(createInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await categoryManager.createCategory(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(updateInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await categoryManager.updateCategory(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(getCategoryInput);

    const { error } = schema.validate(req.params);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await categoryManager.getCategory(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(getCategoryInput);

    const { error } = schema.validate(req.params);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await categoryManager.deleteCategory(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.listCategory = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await categoryManager.listCategory(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
