const mainHelper = require("../../../utils/helper");
const axios = require('axios');

const sendTestWhatsAppMessage = async ({ whatsappNumber }) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  console.log('Sending WhatsApp test message to:', whatsappNumber);
  console.log('Using phoneNumberId:', phoneNumberId);
  console.log('Using accessToken:', accessToken ? 'present' : 'missing');

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: whatsappNumber,
    type: "text",
    text: {
      body: "🎉 Your business is now connected to Whataloop! This is a test message."
    }
  };

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('response.data:-----', response.data);
    return response.data;
  } catch (err) {
    // Log the error details for debugging
    console.error('WhatsApp API error:', err?.response?.data || err.message);
    throw err;
  }
}
  
module.exports = {
...mainHelper,
sendTestWhatsAppMessage
};