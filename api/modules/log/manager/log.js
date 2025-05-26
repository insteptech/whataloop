const logsService = require('../services/log');

exports.create = async (type, data) => {
  return await logsService.create(type, data);
};

exports.getAll = async (type) => {
  return await logsService.findAll(type);
};
