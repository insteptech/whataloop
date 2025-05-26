const businessService = require('../services/business');

exports.createBusiness = (data) => businessService.create(data);
exports.getAllBusinesses = () => businessService.findAll();
exports.getBusinessById = (id) => businessService.findById(id);
exports.updateBusiness = (id, data) => businessService.update(id, data);
exports.deleteBusiness = (id) => businessService.remove(id);
