const e = require("express");
const authService = require("../services/auth.js");
const { getAllModels } = require("../../../middlewares/loadModels");

const {
  sendResponse,
  generateOtp,
  generateAccessToken,
  sendOtp,
} = require("../utils/helper.js");

exports.listUsers = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    sort = "createdAt",
    order = "DESC",
  } = req.query;

  const users = await authService.fetchUsersWithPagination({
    page,
    pageSize,
    search,
    sort,
    order,
  });

  return sendResponse(res, 200, true, "Fetched users successfully", users);
};

exports.getUserById = async (id) => {
  return await authService.findById(id);
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

exports.updateUserProfile = async (userId, updateData) => {
  return await authService.updateUserProfile(userId, updateData);
};

exports.updateProfileByAdmin = async (userId, updateData) => {
  try {
    const user = await authService.findUser({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const { id, role, ...safeUpdateData } = updateData;

    const updatedUser = await authService.updateUserProfile(userId, safeUpdateData);
    return updatedUser;
  } catch (error) {
    throw error;
  }
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


exports.sendOtp = async ({ phone, full_name, type }) => {
  return await authService.sendOtp(phone, full_name, type);
};

exports.verifyOtp = async ({ phone, otp }) => {
  return await authService.verifyOtp(phone, otp);
};

exports.resendOtp = async ({ phone }) => {
  return await authService.resendOtp(phone);
};

exports.login = async ({ phone, otp }) => {
  return await authService.login(phone, otp);
};

exports.userExists = async (phone) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  return !!(await User.findOne({ where: { phone } }));
};