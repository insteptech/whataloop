const businessService = require('../services/business');

exports.createBusiness = (data) => businessService.create(data);
exports.getAllBusinesses = () => businessService.findAll();
exports.getBusinessById = (id) => businessService.findById(id);
exports.updateBusiness = (id, data) => businessService.update(id, data);
exports.deleteBusiness = (id) => businessService.remove(id);
exports.requestOtp = (whatsapp_number) => businessService.requestOtp(whatsapp_number);
exports.verifyOtp = (whatsapp_number, otp) => businessService.verifyOtp(whatsapp_number, otp);