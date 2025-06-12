const {
  otpInput,
  verifyOtpInput,
  userDetailInput,
  // updateUserInput,
  updateUserProfileInput,
  profileCompleteInput,
  userDeleteInput,
  loginInput,
  signupInput
} = require("../validations/auth");
const { buildSchema } = require("../../../middlewares/joiValidation");
const authManager = require("../manager/auth");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");

// exports.sendOtp = async (req, res, next) => {
//   try {
//     const { phone, full_name } = req.body;
//     if (!phone || !full_name)
//       throw new CustomError("Phone and full name are required.", 400);

//     // Delegate to manager
//     await authManager.sendOtp({ phone, full_name });

//     res.status(200).json({
//       message: "OTP sent successfully. Please verify OTP to complete signup.",
//       phone
//     });
//   } catch (error) {
//     next(new CustomError(error.message || "Failed to send OTP.", error.status || 500));
//   }
// };

// exports.signup = async (req, res, next) => {
//   try {
//     const { phone, full_name } = req.body;
//     if (!phone || !full_name)
//       throw new CustomError("Phone and full name are required.", 400);
//     await authManager.sendOtp({ phone, full_name });
//     res.status(200).json({ message: "OTP sent successfully. Please verify OTP to complete signup.", phone });
//   } catch (error) {
//     next(new CustomError(error.message || "Failed to send OTP.", error.status || 500));
//   }
// };

// exports.verifyOtp = async (req, res, next) => {
//   try {
//     const { phone, otp } = req.body;
//     if (!phone || !otp)
//       throw new CustomError("Phone and OTP are required.", 400);
//     const result = await authManager.verifyOtp({ phone, otp });
//     res.status(200).json({ message: "Signup and verification successful.", ...result });
//   } catch (error) {
//     next(new CustomError(error.message || "OTP verification failed.", error.status || 500));
//   }
// };

// exports.resendOtp = async (req, res, next) => {
//   try {
//     const { phone } = req.body;
//     if (!phone)
//       throw new CustomError("Phone is required.", 400);
//     await authManager.resendOtp({ phone });
//     res.status(200).json({ message: "OTP resent successfully.", phone });
//   } catch (error) {
//     next(new CustomError(error.message || "Failed to resend OTP.", error.status || 500));
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { phone, otp } = req.body;
//     if (!phone || !otp)
//       throw new CustomError("Phone and OTP are required.", 400);
//     const result = await authManager.login({ phone, otp });
//     res.status(200).json({ message: "Login successful.", ...result });
//   } catch (error) {
//     next(new CustomError(error.message || "Login failed.", error.status || 500));
//   }
// };

exports.listUsers = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const result = await authManager.listUsers(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const schema = buildSchema(userDetailInput);
    const { error } = schema.validate(req.params);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.getUserDetails(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getMe = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated properly' });
    }
    console.log("Authenticated user id:", req.user?.id);
    const user = await authManager.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    console.log("Authenticated user id:", req.user?.id);
    const schema = buildSchema(updateUserProfileInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.updateUserProfile(req.user.id, req.body);

    res.status(200).json({ message: "User updated successfully", data: result });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updateProfileByAdmin = async (req, res, next) => {
  console.log("Update profile by admin request body:", req.body);
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }
    const userId = req.params.id;
    const updateData = req.body;

    const schema = buildSchema(updateUserProfileInput);
    const { error } = schema.validate(updateData);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.updateProfileByAdmin(userId, updateData);
    res.status(200).json({
      message: "User profile updated successfully by admin",
      data: result
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(userDeleteInput);
    const { error } = schema.validate(req.params);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.deleteUser(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.profileComplete = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(profileCompleteInput);
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    const result = await authManager.profileComplete(req, res);
    return result;
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

//   try {
//     const { phone } = req.body;
//     if (!phone) throw new CustomError("Phone number is required.", 400);
//     const result = await authManager.resendOtp({ phone });
//     res.status(200).json({ message: "OTP resent successfully.", ...result });
//   } catch (error) {
//     next(new CustomError(error.message || "Failed to resend OTP.", error.status || 500));
//   }
// };


// Send OTP for signup
exports.signup = async (req, res, next) => {
  try {
    const { phone, full_name } = req.body;
    if (!phone || !full_name)
      throw new CustomError("Phone and full name are required.", 400);
    const exists = await authManager.userExists(phone);
    if (exists)
      throw new CustomError("User already exists. Please login.", 409);
    await authManager.sendOtp({ phone, full_name, type: "signup" });
    res.status(200).json({ message: "OTP sent for signup.", phone });
  } catch (error) {
    next(new CustomError(error.message || "Failed to send OTP for signup.", error.status || 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    console.log("Login request body:", req.body);
    if (!phone) throw new CustomError("Phone is required.", 400);

    const exists = await authManager.userExists(phone);
    if (!exists)
      throw new CustomError("User not found. Please signup first.", 404);
    await authManager.sendOtp({ phone, type: "login" });
    res.status(200).json({ message: "OTP sent for login.", phone });
  } catch (error) {
    next(new CustomError(error.message || "Failed to send OTP for login.", error.status || 500));
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      throw new CustomError("Phone and OTP are required.", 400);
    const result = await authManager.verifyOtp({ phone, otp });
    res.status(200).json({ message: "OTP verified.", ...result });
  } catch (error) {
    next(new CustomError(error.message || "OTP verification failed.", error.status || 500));
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { phone, type, full_name } = req.body;
    if (!phone) throw new CustomError("Phone is required.", 400);
    await authManager.resendOtp({ phone, type, full_name });
    res.status(200).json({ message: "OTP resent successfully.", phone });
  } catch (error) {
    next(new CustomError(error.message || "Failed to resend OTP.", error.status || 500));
  }
};


exports.refreshToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const token = await authManager.refreshToken(userId);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Failed to refresh token' });
  }
};