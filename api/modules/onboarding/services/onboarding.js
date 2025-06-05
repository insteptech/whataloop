const axios = require('axios');
const { getAllModels } = require("../../../middlewares/loadModels");
const { sendTestWhatsAppMessage } = require('../utils/helper'); // adjust path


const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WEB_HOOK_URL = 'https://rnrsd-2401-4900-1c6f-a87d-548b-15ec-5f72-d5ea.a.free.pinggy.link/api/v1/whatsapp';

const APP_ID = process.env.WHATSAPP_APP_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// 1. Create a business profile
const createBusinessProfile = async (businessName, whatsappNumber, business_id) => {
  const { Onboarding } = await getAllModels(process.env.DB_TYPE);
  if (!Onboarding) {
    throw new Error("Onboarding model not found");
  }

  const existing = await Onboarding.findOne({ where: { whatsapp_number: whatsappNumber } });
  if (existing) {
    throw new Error("WhatsApp number already registered");
  }

  const wabaId = process.env.WABA_ID; // central WABA ID
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const profile = await Onboarding.create({
    business_name: businessName,
    whatsapp_number: whatsappNumber,
    profile_status: "active",
    linked: true,
    waba_id: wabaId,
    waba_phone_id: phoneNumberId,
    raw_payload: null, // or include business_name etc
    business_id: business_id
  });

  return profile;
};

// 2. Associate WhatsApp Number with WABA
const associateBusinessNumber = async (whatsappNumber) => {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/phone_numbers`;
  const data = {
    phone_number: whatsappNumber,
    access_token: ACCESS_TOKEN
 };

  try {
    const response = await axios.post(url, data);
    return response.data;
 } catch (error) {
    throw new Error("Error associating business number: " + error.message);
 }
};

// 3. Set up the Webhook URL to handle incoming messages
const setupWebhook = async () => {
  const url = `${WHATSAPP_API_URL}/${APP_ID}/subscriptions`;

  const data = {
    object: "whatsapp_business_account",
    callback_url: WEB_HOOK_URL,
    fields: ["messages"],
    verify_token: VERIFY_TOKEN
 };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
 }
 });
    return WEB_HOOK_URL;
 } catch (error) {
    console.error("Webhook setup failed:", error.response?.data || error.message);
    throw new Error("Error setting up webhook: " + error.message);
 }
};

const handleWabaOnboarding = async ({ businessId, businessName, whatsappNumber }) => {
  const { Onboarding } = await getAllModels(process.env.DB_TYPE);

  let onboardingProfile;
  try {
    onboardingProfile = await createBusinessProfile(businessName, whatsappNumber, businessId);
  } catch (err) {
    throw new Error('Failed to create onboarding profile: ' + err.message);
  }

  let associationResult;
  try {
    associationResult = await associateBusinessNumber(whatsappNumber);
    onboardingProfile.profile_status = 'waba_associated';
    onboardingProfile.raw_payload = associationResult;
    await onboardingProfile.save();
  } catch (err) {
    onboardingProfile.profile_status = 'failed';
    onboardingProfile.raw_payload = { error: err.message };
    await onboardingProfile.save();
    throw new Error('WABA association failed: ' + err.message);
  }

  try {
    await setupWebhook();
  } catch (err) {
    console.warn('Webhook setup error (ignored):', err.message);
  }

  try {
    await sendTestWhatsAppMessage({ whatsappNumber });
  } catch (err) {
    console.warn('Test WhatsApp message failed (ignored):', err.message);
  }

  return onboardingProfile;
};

module.exports = {
  createBusinessProfile,
  associateBusinessNumber,
  setupWebhook,
  handleWabaOnboarding
};
