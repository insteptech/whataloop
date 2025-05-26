const service = require("../services/businessSubscription");

exports.create = (data) => service.create(data);
exports.findById = (id) => service.findById(id);
exports.findByBusiness = (business_id) => service.findByBusiness(business_id);
exports.update = (id, data) => service.update(id, data);
exports.remove = (id) => service.remove(id);