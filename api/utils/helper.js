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
    console.log(`OTP sent to ${email}`);
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


const getMessageDetails = (payload) =>{
  try {
    const entry = payload?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const waId = value?.contacts?.[0]?.wa_id;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];
    const timestamp = value?.messages?.[0]?.timestamp;
    const receiverNumber = value?.metadata?.display_phone_number;

    return {
      from: message?.from || null,
      text: message?.text?.body || null,
      name: contact?.profile?.name || null,
      waId: waId || null,
      timestamp: timestamp ? new Date(timestamp * 1000) : null,
      receiverNumber: receiverNumber || null
    };
  } catch (err) {
    console.error("Error extracting details:", err.message);
    return {
      from: null,
      text: null,
      name: null,
      waId: null,
      timestamp: null,
      receiverNumber: null
    };
  }
}

module.exports = { sendResponse, verifyToken, sendOtp, generateToken, sanitizePhoneNumber, getUserIdFromToken, getMessageDetails };
