const axios = require('axios');
const { getAllModels } = require("../../../middlewares/loadModels");

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WEB_HOOK_URL = 'https://rnmib-2401-4900-1c6e-1c0f-edb6-91e9-a3a0-720.a.free.pinggy.link';

const APP_ID = process.env.WHATSAPP_APP_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// 1. Create a business profile
const createBusinessProfile = async (businessName, whatsappNumber) => {
  const { Onboarding } = await getAllModels(process.env.DB_TYPE);
  if (!Onboarding) {
    throw new Error("Onboarding model not found");
  }

    const profile = await Onboarding.create({
        business_name: businessName,
        whatsapp_number: whatsappNumber,
        profile_status: 'active'
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
        console.log("Business Number associated:", response.data);
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
      console.log("Webhook setup successful:", response.data);
      return WEB_HOOK_URL;
    } catch (error) {
      console.error("Webhook setup failed:", error.response?.data || error.message);
      throw new Error("Error setting up webhook: " + error.message);
    }
  };


module.exports = {
    createBusinessProfile,
    associateBusinessNumber,
    setupWebhook
  };
  