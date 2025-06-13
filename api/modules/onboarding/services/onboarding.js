// const axios = require('axios');
// const { getAllModels } = require("../../../middlewares/loadModels");
// const { sendTestWhatsAppMessage } = require('../utils/helper');

// const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';
// const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
// const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// const WEB_HOOK_URL = process.env.WEB_HOOK_URL;

// const APP_ID = process.env.WHATSAPP_APP_ID;
// const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// // 1. Create a business profile
// const createBusinessProfile = async (businessName, whatsappNumber, business_id, user_id) => {
//   const { Onboarding } = await getAllModels(process.env.DB_TYPE);
//   if (!Onboarding) {
//     throw new Error("Onboarding model not found");
//   }

//   const existing = await Onboarding.findOne({ where: { whatsapp_number: whatsappNumber } });
//   if (existing) {
//     throw new Error("WhatsApp number already registered");
//   }

//   const wabaId = process.env.WABA_ID; // central WABA ID
//   const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

//   const profile = await Onboarding.create({
//     business_name: businessName,
//     whatsapp_number: whatsappNumber,
//     profile_status: "active",
//     linked: true,
//     waba_id: wabaId,
//     waba_phone_id: phoneNumberId,
//     raw_payload: null,
//     business_id,
//     user_id, // ✅ required to avoid NOT NULL error
//   });

//   console.log('profile:-------', profile, '------------');
//   return profile;
// };

// // 2. Set up the Webhook URL to handle incoming messages
// const setupWebhook = async () => {
//   const url = `${WHATSAPP_API_URL}/${APP_ID}/subscriptions`;

//   const data = {
//     object: "whatsapp_business_account",
//     callback_url: WEB_HOOK_URL,
//     fields: ["messages"],
//     verify_token: VERIFY_TOKEN
//   };

//   try {
//     const response = await axios.post(url, data, {
//       headers: {
//         Authorization: `Bearer ${ACCESS_TOKEN}`
//       }
//     });
//     return WEB_HOOK_URL;
//   } catch (error) {
//     console.error("Webhook setup failed:", error.response?.data || error.message);
//     throw new Error("Error setting up webhook: " + error.message);
//   }
// };

// // 3. WABA onboarding entry point
// const handleWabaOnboarding = async ({ businessId, businessName, whatsappNumber }) => {
//   const { Business, Onboarding } = await getAllModels(process.env.DB_TYPE);

//   const business = await Business.findByPk(businessId);
//   if (!business) {
//     throw new Error(`Business not found with ID: ${businessId}`);
//   }

//   let onboardingProfile;
//   try {
//     console.log('Creating onboarding profile...');
//     onboardingProfile = await createBusinessProfile(businessName, whatsappNumber, businessId, business.user_id);
//     console.log('Onboarding profile created.');
//   } catch (err) {
//     console.error('Failed to create onboarding profile:', err.message);
//     throw new Error('Failed to create onboarding profile: ' + err.message);
//   }

//   onboardingProfile.profile_status = 'waba_associated';
//   onboardingProfile.raw_payload = { info: 'Number managed via Meta dashboard, no API association required.' };
//   await onboardingProfile.save();
//   console.log('Business number marked as associated and profile updated.');

//   try {
//     console.log('Setting up webhook...');
//     await setupWebhook();
//     console.log('Webhook setup completed.');
//   } catch (err) {
//     console.warn('Webhook setup error (ignored):', err.message);
//   }

//   try {
//     console.log('Attempting to send WhatsApp message to:', whatsappNumber);
//     await sendTestWhatsAppMessage({ whatsappNumber });
//     console.log('sendTestWhatsAppMessage completed');
//   } catch (err) {
//     console.warn('Test WhatsApp message failed (ignored):', err.message);
//   }

//   console.log('Returning onboardingProfile...');
//   return onboardingProfile;
// };

// module.exports = {
//   createBusinessProfile,
//   setupWebhook,
//   handleWabaOnboarding
// };


const axios = require('axios');
const { getAllModels } = require("../../../middlewares/loadModels");
const { sendTestWhatsAppMessage } = require('../utils/helper');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WEB_HOOK_URL = process.env.WEB_HOOK_URL;

const APP_ID = process.env.WHATSAPP_APP_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// 1. Create a business profile
const createBusinessProfile = async (businessName, whatsappNumber, business_id, user_id, transaction) => {
  const { Onboarding } = await getAllModels(process.env.DB_TYPE);
  if (!Onboarding) {
    throw new Error("Onboarding model not found");
  }

  const existing = await Onboarding.findOne({ where: { whatsapp_number: whatsappNumber }, transaction });
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
    raw_payload: null,
    business_id,
    user_id
  }, { transaction });

  return profile;
};

// 2. Set up the Webhook URL to handle incoming messages
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

// 3. WABA onboarding entry point
const handleWabaOnboarding = async ({ businessId, businessName, whatsappNumber, transaction }) => {
  const { Business, Onboarding } = await getAllModels(process.env.DB_TYPE);

  const business = await Business.findByPk(businessId, { transaction });
  if (!business) {
    throw new Error(`Business not found with ID: ${businessId}`);
  }

  let onboardingProfile;
  try {
    console.log('Creating onboarding profile...');
    onboardingProfile = await createBusinessProfile(businessName, whatsappNumber, businessId, business.user_id, transaction);
    console.log('Onboarding profile created.');
  } catch (err) {
    console.error('Failed to create onboarding profile:', err.message);
    throw new Error('Failed to create onboarding profile: ' + err.message);
  }

  onboardingProfile.profile_status = 'waba_associated';
  onboardingProfile.raw_payload = { info: 'Number managed via Meta dashboard, no API association required.' };
  await onboardingProfile.save({ transaction });
  console.log('Business number marked as associated and profile updated.');

  try {
    console.log('Setting up webhook...');
    await setupWebhook();
    console.log('Webhook setup completed.');
  } catch (err) {
    console.warn('Webhook setup error (ignored):', err.message);
  }

  try {
    console.log('Attempting to send WhatsApp message to:', whatsappNumber);
    await sendTestWhatsAppMessage({ whatsappNumber });
    console.log('sendTestWhatsAppMessage completed');
  } catch (err) {
    console.warn('Test WhatsApp message failed (ignored):', err.message);
  }

  console.log('Returning onboardingProfile...');
  return onboardingProfile;
};

module.exports = {
  createBusinessProfile,
  setupWebhook,
  handleWabaOnboarding
};
