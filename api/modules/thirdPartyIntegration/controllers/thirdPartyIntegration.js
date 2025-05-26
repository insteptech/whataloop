const manager = require('../manager/thirdPartyIntegration');

exports.create = async (req, res) => {
  const response = await manager.create(req.body);
  res.status(response.status).json(response.data);
};

exports.findById = async (req, res) => {
  const response = await manager.findById(req.params.id);
  res.status(response.status).json(response.data);
};

exports.findByBusiness = async (req, res) => {
  const response = await manager.findByBusiness(req.params.businessId);
  res.status(response.status).json(response.data);
};

exports.update = async (req, res) => {
  const response = await manager.update(req.params.id, req.body);
  res.status(response.status).json(response.data);
};

exports.remove = async (req, res) => {
  const response = await manager.remove(req.params.id);
  res.status(response.status).json(response.data);
};
