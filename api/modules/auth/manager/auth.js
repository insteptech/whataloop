const authService = require("../services/auth.js");
const {
  // sendOtp,
  sendResponse,
  generateOtp,
  generateAccessToken,
  sendOtp,
} = require("../utils/helper.js");
const { OTP_EXPIRATION_TIME, TEST_MOBILE_US, TEST_MOBILE_IN, TEST_OTP } =
  process.env;

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  // Check if the mobile number is a test number

  const isTestMobile = mobile === TEST_MOBILE_US || mobile === TEST_MOBILE_IN;
  const otp = isTestMobile ? TEST_OTP : await generateOtp(); // Use static OTP if test mobile, otherwise generate

  const otpExpires = new Date(Date.now() + OTP_EXPIRATION_TIME * 1000);

  let user = await authService.findUser({ mobile });
  if (!user) {
    user = await authService.createUser({
      mobile,
      otp,
      otpExpires,
    });
    authService.updateOtp(mobile, otp, otpExpires);
  } else {
    await authService.updateOtp(mobile, otp, otpExpires);
  }

  if (!isTestMobile) {
    // Send OTP only for non-test mobile numbers
    console.log(`OTP sent to ${mobile}: ${otp}`); // Log for debugging (remove in production)
    // Place actual OTP sending code here (e.g., via Twilio)
    await sendOtp(mobile, otp);
  } else {
    console.log(`Static OTP used for test mobile ${mobile}: ${otp}`);
  }

  return sendResponse(res, 200, true, "OTP sent successfully", {
    otp: otp,
  }); // Optionally return OTP for test numbers
};

exports.verifyOtp = async (req, res) => {
  // Verify OTP and retrieve user if OTP is valid
  const { mobile, otp } = req.body;
  const user = await authService.findByMobileAndOtp(mobile, otp);
  if (!user) {
    console.log(`Invalid OTP for mobile ${mobile}`); // Log invalid attempts for debugging
    throw new Error("Invalid OTP");
  }

  // Clear OTP after successful verification
  await authService.clearOtp(mobile);

  // Generate JWT token with role included

  const token = await generateAccessToken(user);

  // Return the token and essential user information

  return sendResponse(res, 200, true, "User Logined", user, token);
};

exports.listUsers = async (req, res) => {
  const { page, pageSize } = req.query;
  const users = await authService.fetchUsersWithPagination({
    page: page ? page : 1,
    pageSize: pageSize ? pageSize : 10,
  });
  return sendResponse(res, 200, true, "Fetch users successfully", users);
};

exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  const user = await authService.findUser({
    id,
  });
  let message = "Fetch users detail";
  if (!user) {
    message = "User Detail not found";
  }
  return sendResponse(res, 200, true, message, user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.decoded;
  const user = await authService.updateUser(req.body, { id });
  return sendResponse(res, 200, true, "User updated successfully", user);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await authService.deleteUser({
    id,
  });
  return sendResponse(res, 200, true, "User deleted successfully", user);
};

exports.profileComplete = async (req, res) => {
  // Verify OTP and retrieve user if OTP is valid
  const { id } = req.decoded;
  await authService.profileComplete(req.body, { id });

  // Generate JWT token with role included
  let user = await authService.findUser({ id });
  const token = await generateAccessToken(user);

  // Return the token and essential user information

  return sendResponse(res, 200, true, "User Logined", user, token);
};
