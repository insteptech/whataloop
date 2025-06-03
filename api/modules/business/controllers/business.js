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

exports.requestOtp = async (req, res) => {
  try {
    const { whatsapp_number } = req.body;
    const result = await businessManager.requestOtp(whatsapp_number);
    res.status(200).json(result);
  } catch (err) {
    // Proper error structure
    res.status(400).json({
      status: "error",
      message: err.message || "Something went wrong"
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { whatsapp_number, otp } = req.body;
  const result = await businessManager.verifyOtp(whatsapp_number, otp);
  res.status(200).json(result);
};