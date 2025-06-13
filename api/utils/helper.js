const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendResponse = (
  res,
  statusCode = 200,
  success = true,
  message = "",
  data = null,
  token = null
) => {
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    token,
  });
};

const verifyToken = function (token, callback) {
  return jwt.verify(token, process.env.JWT_SECRET, {}, callback);
};

const sendOtp = async (email, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: email,
    });
  } catch (error) {
    throw { error };
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizePhoneNumber = (phone) => {
  if (phone.startsWith('+')) {
    return phone.slice(1);
  }
  return phone;
}

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // or decoded.id depending on your payload
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};


const getMessageDetails = (payload) => {
  try {
    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const contact = value?.contacts?.[0];
    const message = value?.messages?.[0];
    const metadata = value?.metadata;

    const waId = contact?.wa_id || null;
    const from = message?.from || contact?.wa_id || null;
    const timestamp = message?.timestamp
      ? new Date(Number(message.timestamp) * 1000)
      : new Date(); // fallback to now

    const receiverNumber = metadata?.display_phone_number || null;

    // Extract text based on message type
    let text = null;
    if (message?.type === 'text') {
      text = message.text?.body;
    } else if (message?.type === 'button') {
      text = message.button?.text;
    } else if (message?.type === 'interactive') {
      text = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title;
    }

    return {
      from,
      text: text || null,
      name: contact?.profile?.name || null,
      waId,
      timestamp,
      receiverNumber
    };
  } catch (err) {
    console.error("❌ Error extracting WhatsApp message details:", err.message);
    return {
      from: null,
      text: null,
      name: null,
      waId: null,
      timestamp: new Date(),
      receiverNumber: null
    };
  }
};

module.exports = { sendResponse, verifyToken, sendOtp, generateToken, sanitizePhoneNumber, getUserIdFromToken, getMessageDetails };
