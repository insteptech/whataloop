const businessManager = require('../manager/business');

exports.createBusiness = async (req, res) => {
  const result = await businessManager.createBusiness(req.body);
  res.status(201).json(result);
};

exports.getAllBusinesses = async (req, res) => {
  const result = await businessManager.getAllBusinesses();
  res.json(result);
};

exports.getBusinessById = async (req, res) => {
  const result = await businessManager.getBusinessById(req.params.id);
  res.json(result);
};

exports.updateBusiness = async (req, res) => {
  const result = await businessManager.updateBusiness(req.params.id, req.body);
  res.json(result);
};

exports.deleteBusiness = async (req, res) => {
  const result = await businessManager.deleteBusiness(req.params.id);
  res.json(result);
};
