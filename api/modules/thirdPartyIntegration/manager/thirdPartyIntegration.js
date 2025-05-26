const service = require('../services/thirdPartyIntegration');

exports.create = async (data) => await service.create(data);
exports.findById = async (id) => await service.findById(id);
exports.findByBusiness = async (businessId) => await service.findByBusiness(businessId);
exports.update = async (id, data) => await service.update(id, data);
exports.remove = async (id) => await service.remove(id);
