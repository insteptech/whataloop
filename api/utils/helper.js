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

const sendOtp = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code for cura-x-ai is ${otp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log(`OTP sent to ${phoneNumber}`);
  } catch (error) {
    throw { error };
  }
};

module.exports = { sendResponse, verifyToken, sendOtp };
