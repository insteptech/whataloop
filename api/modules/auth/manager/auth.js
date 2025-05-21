const e = require("express");
const authService = require("../services/auth.js");


const {
  sendResponse,
  generateOtp,
  generateAccessToken,
  sendOtp,
} = require("../utils/helper.js");

exports.sendOtp = async (req, res) => {
  const otp = process.env.TEST_OTP;
  const email = req.body.email.toLowerCase();

  console.log(`Sending OTP to ${email}`);
  console.log(`OTP is ${otp}`);


  try {
    const user = await authService.findUser({ email });

    if (user) {
      console.log(`User already exists with email ${email}`);
      return sendResponse(res, 400, true, "Email already exists");
    } else {
      console.log(`OTP is ${otp} for ${email}`);
      return sendResponse(res, 200, true, "OTP sent successfully", { email, otp });
    }
  } catch (err) {
    return sendResponse(res, 500, false, "Something went wrong", err.message);
  }
};



exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const generatedOtp = process.env.TEST_OTP;
  const user = await authService.findUser({ email: email });
  if (!user) {
    if (otp !== generatedOtp) {
      console.log(`Invalid OTP for email ${email}`);
      throw new Error("Invalid OTP");
    } else {
      return sendResponse(res, 200, true, "OTP Verified", email);
    }
  }
};

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

exports.login = async (req, res, next) => {
  try {
    const { email, password, id } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const result = await authService.login(email, password, id);

    return res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res) => {
  const { phone, email, fullName, password } = req.body;

  // Check if user already exists with the same email
  let user = await authService.findUser({ email: email.toLowerCase() });
  if (user) {
    return sendResponse(res, 400, true, "Email already exists");
  }

  // Check if user already exists with the same phone number
  user = await authService.findUser({ phone });
  if (user) {
    return sendResponse(res, 400, true, "Phone number already exists");
  }

  // If no existing user found, proceed with signup
  user = await authService.signup({
    phone,
    email,
    fullName,
    password,
  });

  return sendResponse(res, 200, true, "User successfully created", {
    id: user.id,
    phone: user.phone,
    email: user.email,
    fullName: user.fullName,
  });
};
