const {
  otpInput,
  addLeadInput
} = require("../validations/lead");
const { buildSchema } = require("../../../middlewares/joiValidation");
const leadManager = require("../manager/lead");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");

exports.sendOtp = async (req, res, next) => {
  try {
    const schema = buildSchema(otpInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    const result = await leadManager.sendOtp({ email: req.body.email });
    res.status(200).json({ message: "OTP sent successfully", ...result });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.addLead = async (req, res, next) => {
  try {
    const schema = buildSchema(addLeadInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    const result = await leadManager.addLead(req.body);
    res.status(200).json({ message: "Lead Successfully Created", ...result });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.create = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      user_id: req?.user?.dataValues?.id,
    };

    const lead = await leadManager.createLead(leadData, req?.user?.dataValues?.id);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error creating lead:", err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const leads = await leadManager.getLeads(req.user.id, req.query);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedLead = await leadManager.updateLead(req.params.id, req.user.id, req.body);
    res.status(200).json({ updatedLead, message: "Lead updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await leadManager.deleteLead(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Delete Lead Error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.addLead = async (req, res, next) => {
  try {
    const schema = buildSchema(addLeadInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));
    const result = await leadManager.addLead(req.body);
    res.status(200).json({ message: "Lead Successfully Created", ...result });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.create = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      user_id: req?.user?.dataValues?.id,
    };

    const lead = await leadManager.createLead(leadData, req?.user?.dataValues?.id);
    res.status(200).json(lead);
  } catch (err) {
    console.error("Error creating lead:", err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const leads = await leadManager.getLeads(req.user.id, req.query);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedLead = await leadManager.updateLead(req.params.id, req.user.id, req.body);
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await leadManager.deleteLead(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


