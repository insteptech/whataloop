const { getAllModels } = require("../../../middlewares/loadModels");
const axios = require('axios');
const QRCode = require('qrcode');
const leadQualityService = require('../../lead/services/leadQualityService');
const { getMessageDetails } = require('../../../utils/helper');
const leadService = require('../../lead/services/lead');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const DEFAULT_TAG_ID = process.env.DEFAULT_TAG_ID;
const DEFAULT_STATUS_ID = process.env.DEFAULT_STATUS_ID;
const WHATSAPP_SOURCE_ID = process.env.WHATSAPP_SOURCE_ID;
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID;


// const handleIncomingMessage = async (data) => {

//   const { WhatsApp } = await getAllModels(process.env.DB_TYPE);
//    if(!WhatsApp) {
//     throw new Error('WhatsApp model not found');
//   }
//   await WhatsApp.create({
//     raw_payload: JSON.stringify(data),
//   });
// };

const handleIncomingMessage = async (data) => {
  console.log('🔧 Processing WhatsApp Payload:', JSON.stringify(data, null, 2));

  const { WhatsApp } = await getAllModels(process.env.DB_TYPE);
  if (!WhatsApp) {
    throw new Error('WhatsApp model not found');
  }

  await WhatsApp.create({
    raw_payload: JSON.stringify(data),
  });

  console.log('✅ WhatsApp payload saved to DB');
};

const createWhatsappEntry = async (payload) => {
  const { WhatsApp } = await getAllModels(process.env.DB_TYPE);
  if(!WhatsApp) {
    throw new Error('WhatsApp model not found');
  }
  await WhatsApp.create({ raw_payload: JSON.stringify(payload) });
};

const saveRawPayload = async (payload) => {
  const messageDetails = getMessageDetails(payload);
  const qualityLabel = await leadQualityService.analyzeMessage(messageDetails?.text, "");
  console.log('🔍 Message Quality Label:', qualityLabel);


  const { WhatsApp, User } = await getAllModels(process.env.DB_TYPE);
  // const user = await User.findOne({
  //   where: { phone: messageDetails.waId } // or { phone: '+91' + waId.slice(2) } if your DB uses '+'
  // });
  
  if (qualityLabel != 'unclear') {
  await leadService.createIfNotExists({
      phone: messageDetails.from,
      full_name: messageDetails.name,
      source: WHATSAPP_SOURCE_ID,        
      user_id: DEFAULT_USER_ID,                
      tag: DEFAULT_TAG_ID,               
      status: DEFAULT_STATUS_ID,
      last_message: messageDetails.text,
      qualityLabel: qualityLabel,
      timestamp: messageDetails.timestamp,
      receiverNumber: messageDetails.receiverNumber,
    });
  }

  if(!WhatsApp) {
    throw new Error('WhatsApp model not found');
  }
  
  await WhatsApp.create({
    raw_payload: payload,
  });
};

const sendTextMessage = async (toPhone, messageText) => {
  const { WhatsApp } = await getAllModels(process.env.DB_TYPE);
  if(!WhatsApp) {
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
    // console.log('Sending message to WhatsApp API...');
    console.log('📩 Sending message:---------------', url, payload, { headers });
    
    const { data } = await axios.post(url, payload, { headers });
    // console.log('Message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending message to WhatsApp API:', error);
    throw error;
  }
};

const generateLeadLink = async (user, message = '', campaign = '') => {
  // Use WhatsApp business number or user's phone
  const number = user.whatsapp_number || user.phone;
  if (!number) throw new Error('No WhatsApp number found for user.');
  const text = message || 'Hi, I’m interested!';
  const link = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  const qr = await QRCode.toDataURL(link);
  // Optional: Save to DB, add campaign analytics, etc.
  return { link, qr };
};



module.exports = {
    handleIncomingMessage,
    createWhatsappEntry,
    saveRawPayload,
    sendTextMessage,
    generateLeadLink
  };
  