const manager = require('../manager/subscriptionPlan');

exports.create = async (req, res) => {
  const result = await manager.create(req.body);
  res.status(result.status).json(result.data);
};

exports.findById = async (req, res) => {
  const result = await manager.findById(req.params.id);
  res.status(result.status).json(result.data);
};

exports.findAll = async (req, res) => {
  const result = await manager.findAll();
  res.status(result.status).json(result.data);
};

exports.update = async (req, res) => {
  const result = await manager.update(req.params.id, req.body);
  res.status(result.status).json(result.data);
};

exports.remove = async (req, res) => {
  const result = await manager.remove(req.params.id);
  res.status(result.status).json(result.data);
};
