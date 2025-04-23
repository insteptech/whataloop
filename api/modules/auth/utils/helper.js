const mainHelper = require("../../../utils/helper");
const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
  const tokenObj = {
    id: user.id,
    uuid: user.uuid,
    mobile: user.mobile,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    // isProfileComplete: user.isProfileComplete,
  };
  if (user.roles && user.roles.length > 0) {
    tokenObj["roles"] = user.roles.map((a) => a.name);
  }

  const token = jwt.sign(tokenObj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
  });
  return token;
};

const generateOtp = async () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP
};

module.exports = {
  ...mainHelper,
  generateAccessToken,
  generateOtp,
};
