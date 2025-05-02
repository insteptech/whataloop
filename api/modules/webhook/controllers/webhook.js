const webhookManager = require('../manager/webhook');
const CustomError = require("../../../middlewares/customError");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");

exports.createWebhookMessage = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const result = await webhookManager.createWebhookMessage(req, res, next);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getMessagesByLead = async (req, res) => {
    try {
      if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
        return next(new CustomError(unsupportedDBType, 400));
      }

      const result = await webhookManager.getMessagesByLead(req, res);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };