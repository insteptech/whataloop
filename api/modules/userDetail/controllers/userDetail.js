// Content for userDetail.js
const { userDetailInput, addressInput } = require("../validations/userDetail");
const { buildSchema } = require("../../../middlewares/joiValidation");
const userDetailManager = require("../manager/userDetail");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");

exports.addUpdateDetail = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(userDetailInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await userDetailManager.addUpdateDetail(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.addUpdateAddress = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(addressInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await userDetailManager.addUpdateAddress(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.fetchUserDetail = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await userDetailManager.fetchUserDetail(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.addUpdateInfo = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await userDetailManager.addUpdateInfo(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.addReportDetail = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await userDetailManager.addReportDetail(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.fetchLatestReportDetail = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await userDetailManager.fetchLatestReportDetail(
      req,
      res,
      next
    );
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
