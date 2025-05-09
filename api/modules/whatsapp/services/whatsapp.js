const { getAllModels } = require("../../../middlewares/loadModels");
const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const handleIncomingMessage = async (data) => {
  // const phone = from.replace('whatsapp:', '');
  // const { Whatsapp, Lead } = await getAllModels(process.env.DB_TYPE);
  // console.log('whatsapp:----', Whatsapp);
  
  // if(!Whatsapp) {
  //   throw new Error('WhatsApp model not found');
  // }
  // if(!Lead) {
  //   throw new Error('Lead model not found');
  // }
  // const lead = await Lead.findOne({ where: { phone } });

  // const message = await Whatsapp.create({
  //   phone,
  //   body,
  //   sender_name: senderName,
  //   direction: 'incoming',
  //   lead_id: lead?.id || null,
  // });

  // return message;
  const { Whatsapp } = await getAllModels(process.env.DB_TYPE);
   if(!Whatsapp) {
    throw new Error('WhatsApp model not found');
  }
  await Whatsapp.create({
    raw_payload: JSON.stringify(data),
  });
};

const createWhatsappEntry = async (payload) => {
  const { Whatsapp } = await getAllModels(process.env.DB_TYPE);
  if(!Whatsapp) {
    throw new Error('WhatsApp model not found');
  }
  await Whatsapp.create({ raw_payload: JSON.stringify(payload) });
};

const saveRawPayload = async (payload) => {
  const { Whatsapp } = await getAllModels(process.env.DB_TYPE);
  if(!Whatsapp) {
    throw new Error('WhatsApp model not found');
  }
  
  await Whatsapp.create({
    raw_payload: payload,
  });
};

const sendTextMessage = async (toPhone, messageText) => {
  const { Whatsapp } = await getAllModels(process.env.DB_TYPE);
  if(!Whatsapp) {
   throw new Error('WhatsApp model not found');
  }
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error('WhatsApp API credentials are not set.');
  }

  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone.replace('+', ''),
    type: 'text',
    text: { body: messageText },
  };

  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    console.log('Sending message to WhatsApp API...');
    const { data } = await axios.post(url, payload, { headers });
    console.log('Message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending message to WhatsApp API:', error);
    throw error;
  }
};



module.exports = {
    handleIncomingMessage,
    createWhatsappEntry,
    saveRawPayload,
    sendTextMessage
  };
  