const {
  otpInput,
  verifyOtpInput,
  userDetailInput,
  updateUserInput,
  profileCompleteInput,
  userDeleteInput,
  loginInput,
  signupInput
} = require("../validations/auth");
const { buildSchema } = require("../../../middlewares/joiValidation");
const authManager = require("../manager/auth");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");
const userManager = require('../manager/auth');


exports.sendOtp = async (req, res, next) => {
  try {
    const schema = buildSchema(otpInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    const result = await authManager.sendOtp(req, res);
    res.status(200).json({ message: "OTP sent successfully", ...result });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const schema = buildSchema(verifyOtpInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.verifyOtp(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const result = await authManager.listUsers(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(userDetailInput);
    const { error } = schema.validate(req.params);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.getUserDetails(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated properly' });
    }
    const user = await authManager.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(updateUserInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.updateUser(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(userDeleteInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.deleteUser(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.profileComplete = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(profileCompleteInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.profileComplete(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(loginInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.login(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.signup = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(signupInput);

    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.signup(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};