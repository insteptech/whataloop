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
    // Log full error details if present
    if (err.response) {
      console.error('WhatsApp API error:');
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
      console.error('Headers:', JSON.stringify(err.response.headers, null, 2));
    } else {
      console.error('WhatsApp API error (no response):', err.message);
    }
    throw err; // Propagate error up
  }
};

module.exports = {
  ...mainHelper,
  sendTestWhatsAppMessage
};
