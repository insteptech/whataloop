const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const sendOtpToWhatsapp = require('../../../utils/sendOtpToWhatsapp');
const onboardingService = require('../../onboarding/services/onboarding');

// 1. Request OTP (send to WhatsApp)

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

const requestOtp = async (whatsapp_number) => {
  if (!whatsapp_number) throw new Error("WhatsApp number is required.");

  const { Business } = await getAllModels(process.env.DB_TYPE);
  const existingBusiness = await Business.findOne({ where: { whatsapp_number } });
  if (existingBusiness) {
    throw new Error("This WhatsApp number is already registered with another business.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendOtpToWhatsapp(whatsapp_number, otp);
  await redisClient.set(`BUSINESS_OTP_${whatsapp_number}`, otp, { EX: 600 });
  return { message: "OTP sent to WhatsApp number." };
};
// 2. Verify OTP
// const verifyOtp = async (whatsapp_number, otp) => {
//   const storedOtp = await redisClient.get(`BUSINESS_OTP_${whatsapp_number}`);
//   if (!storedOtp) throw new Error("OTP expired or invalid.");
//   if (storedOtp !== otp) throw new Error("Invalid OTP.");
//   await redisClient.set(`BUSINESS_OTP_VERIFIED_${whatsapp_number}`, "true", { EX: 600 });
//   return { message: "OTP verified successfully." };
// };

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

const connectBusiness = async ({ business_name, whatsapp_number, user_id }) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);

  if (!business_name || !whatsapp_number || !user_id) {
    throw new Error("Missing required fields: business_name, whatsapp_number, user_id");
  }

  const business = await Business.findOne({ where: { whatsapp_number } });
  if (business) throw new Error("This WhatsApp number is already registered.");

  const otp = generateOtp();

  // Save all required info in Redis (serialized JSON)
  const businessData = JSON.stringify({ business_name, whatsapp_number, user_id, otp });
  await redisClient.set(`BUSINESS_CONNECT_${whatsapp_number}`, businessData, { EX: 600 });

  await sendOtpToWhatsapp(whatsapp_number, otp);

  return { success: true, message: 'OTP sent to WhatsApp number.', otp: otp };
};

const verifyOtp = async ({ whatsapp_number, otp }) => {
  const { Business, User } = await getAllModels(process.env.DB_TYPE);

  // 1. Get Redis data
  const businessDataRaw = await redisClient.get(`BUSINESS_CONNECT_${whatsapp_number}`);
  if (!businessDataRaw) throw new Error("OTP expired or invalid.");

  const businessData = JSON.parse(businessDataRaw);

  if (otp !== businessData.otp) throw new Error("Invalid OTP.");

  // 2. Check if user_id is present
  if (!businessData.user_id) {
    console.error(`[verifyOtp] user_id missing in Redis payload:`, businessData);
    throw new Error("User ID missing. Please sign up or log in first.");
  }

  // 3. Ensure user exists (FK check)
  const user = await User.findByPk(businessData.user_id);
  if (!user) throw new Error("User not found. Please complete signup first.");

  // 4. Double-check business is not already created
  let business = await Business.findOne({ where: { whatsapp_number } });
  if (business) throw new Error("This WhatsApp number is already registered.");

  // 5. Create business now
  business = await Business.create({
    name: businessData.business_name,
    whatsapp_number,
    user_id: businessData.user_id,
    status: 'verified',
  });

  // 6. Onboarding (non-blocking)
  try {
    await onboardingService.handleWabaOnboarding({
      businessId: business.id,
      businessName: business.name,
      whatsappNumber: business.whatsapp_number
    });
  } catch (err) {
    console.error("WABA onboarding failed:", err.message);
  }

  // 7. Cleanup Redis
  await redisClient.del(`BUSINESS_CONNECT_${whatsapp_number}`);

  return { success: true, businessId: business.id };
};

const updateInfo = async ({ businessId, industry, website, welcome_message }) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const business = await Business.findByPk(businessId);
  if (!business) throw new Error('Business not found.');

  if (industry !== undefined) business.industry = industry;
  if (website !== undefined) business.website = website;
  if (welcome_message !== undefined) business.welcome_message = welcome_message;

  await business.save();
  return { success: true };
};
const setWelcomeMessage = async ({ businessId, welcome_message }) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);

  const business = await Business.findByPk(businessId);
  if (!business) throw new Error('Business not found.');
  business.welcome_message = welcome_message;
  await business.save();
  return { success: true };
};


const resendOtp = async ({ businessId }) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  const business = await Business.findByPk(businessId);
  if (!business) throw new Error("Business not found.");

  const otp = generateOtp();
  business.otp = otp;
  business.otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  await business.save();

  await sendOtpToWhatsapp(business.whatsapp_number, otp);

  return { success: true, message: "OTP resent successfully." };
};

const getBusinessByUserId = async (userId) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  return Business.findOne({ where: { user_id: userId } });
};

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove,
  requestOtp,
  connectBusiness,
  verifyOtp,
  updateInfo,
  setWelcomeMessage,
  resendOtp,
  getBusinessByUserId
};
