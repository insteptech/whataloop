const businessService = require('../services/business');

exports.createBusiness = (data) => businessService.create(data);
exports.getAllBusinesses = () => businessService.findAll();
exports.getBusinessById = (id) => businessService.findById(id);
exports.updateBusiness = (id, data) => businessService.update(id, data);
exports.deleteBusiness = (id) => businessService.remove(id);
exports.requestOtp = (whatsapp_number) => businessService.requestOtp(whatsapp_number);
// exports.verifyOtp = (whatsapp_number, otp) => businessService.verifyOtp(whatsapp_number, otp);

exports.connectBusiness = async (payload) => {
  return businessService.connectBusiness(payload);
};

exports.verifyOtp = async (payload) => {
  return businessService.verifyOtp(payload);
};

exports.updateInfo = async (payload) => {
  return businessService.updateInfo(payload);
};

exports.setWelcomeMessage = async (payload) => {
  return businessService.setWelcomeMessage(payload);
};

exports.resendOtp = async ({ businessId }) => {
  return businessService.resendOtp({ businessId });
};

exports.findByUserId = async (userId) => {
  return businessService.getBusinessByUserId(userId);
};