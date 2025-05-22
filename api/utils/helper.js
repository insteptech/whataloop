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

module.exports = { sendResponse, verifyToken, sendOtp, generateToken, sanitizePhoneNumber };
