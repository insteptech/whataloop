const service = require('../services/subscriptionPlan');

exports.create = (data) => service.create(data);
exports.findById = (id) => service.findById(id);
exports.findAll = () => service.findAll();
exports.update = (id, data) => service.update(id, data);
exports.remove = (id) => service.remove(id);
