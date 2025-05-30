const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const sendOtpToWhatsapp = require('../../../utils/sendOtpToWhatsapp');

// 1. Request OTP (send to WhatsApp)

const requestOtp = async (whatsapp_number) => {
  if (!whatsapp_number) throw new Error("WhatsApp number is required.");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendOtpToWhatsapp(whatsapp_number, otp);
  await redisClient.set(`BUSINESS_OTP_${whatsapp_number}`, otp, { EX: 600 }); // Correct way to set expiry in redis v4
  return { message: "OTP sent to WhatsApp number." };
};

// 2. Verify OTP
const verifyOtp = async (whatsapp_number, otp) => {
  const storedOtp = await redisClient.get(`BUSINESS_OTP_${whatsapp_number}`);
  if (!storedOtp) throw new Error("OTP expired or invalid.");
  if (storedOtp !== otp) throw new Error("Invalid OTP.");
  await redisClient.set(`BUSINESS_OTP_VERIFIED_${whatsapp_number}`, "true", { EX: 600 });
  return { message: "OTP verified successfully." };
};

// 3. Create Business (requires OTP verification)
const create = async (data) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);

  if (!Business) throw new Error("Business model not found.");
  if (!data.user_id || !data.name || !data.whatsapp_number) {
    throw new Error("Missing required fields: user_id, name, whatsapp_number.");
  }

  // WhatsApp OTP check
  const isVerified = await redisClient.get(`BUSINESS_OTP_VERIFIED_${data.whatsapp_number}`);
  if (isVerified !== "true") {
    throw new Error("WhatsApp number not verified. Please verify OTP first.");
  }

  const business = await Business.create({
    user_id: data.user_id,
    name: data.name,
    whatsapp_number: data.whatsapp_number,
    description: data.description,
    website: data.website,
    logo_url: data.logo_url,
  });

  // Cleanup verified flag so business cannot be created multiple times with same OTP
  await redisClient.del(`BUSINESS_OTP_VERIFIED_${data.whatsapp_number}`);
  return { status: 201, data: business };
};

// 4. Standard CRUD
const findById = async (id) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const business = await Business.findByPk(id);
  return business ? { status: 200, data: business } : { status: 404, data: { message: 'Business not found' } };
};

const findAll = async () => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const businesses = await Business.findAll();
  return { status: 200, data: businesses };
};

const update = async (id, data) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const [updated] = await Business.update(data, { where: { id } });
  return updated ? { status: 200, data: { message: 'Updated successfully' } } : { status: 404, data: { message: 'Business not found' } };
};

const remove = async (id) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const deleted = await Business.destroy({ where: { id } });
  return deleted ? { status: 200, data: { message: 'Deleted successfully' } } : { status: 404, data: { message: 'Business not found' } };
};

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove,
  requestOtp,
  verifyOtp
};
