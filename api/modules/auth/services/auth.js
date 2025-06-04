const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");
const User = require("../models/user");
const stripe = require('../../../utils/stripe');
const {
  sendResponse,
  generateOtp,
  generateAccessToken,
} = require("../utils/helper.js");
const sendWhatsAppOtp = require("../utils/sendWhatsAppOtp");
const otpCache = new Map();


const findUser = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    throw new Error("Invalid 'where' condition. Must be a non-empty object.");
  }

  const sanitizedWhere = Object.fromEntries(
    Object.entries(where).filter(([_, v]) => v !== undefined)
  );

  const { User, Role, Permission } = await getAllModels(process.env.DB_TYPE);
  if (!User) {
    throw new Error("User model not found");
  }

  let includes = [];
  let roleIncludes = [];

  if (Permission) {
    roleIncludes.push({
      model: Permission,
      attributes: ["name", "description", "route", "type", "action"],
      as: "permissions",
    });
  }

  if (Role) {
    includes.push({
      model: Role,
      attributes: ["name", "description"],
      as: "roles",
      include: roleIncludes,
    });
  }

  const user = await User.findOne({
    where: sanitizedWhere,
    include: includes,
  });

  return user;
};

const findById = async (id) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  const user = await User.findByPk(id, {
    attributes: ['id', 'full_name', 'email', 'phone', 'photo_url', 'account_type', 'timezone'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const createUser = async (requestBody) => {
  const { User, UserRole, SubscriptionPlan, sequelize } = await getAllModels(process.env.DB_TYPE);

  const transaction = await sequelize.transaction();
  try {
    requestBody["uuid"] = uuidv4();
    const user = await User?.create(requestBody, { transaction });
    await UserRole?.create({ userId: user.id, roleId: 2 }, { transaction });
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


const deleteUser = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }

  const { User, UserRole } = await getAllModels(process.env.DB_TYPE);

  const user = await User.findOne({ where });
  if (!user) {
    throw { message: "User not found" };
  }

  await UserRole.destroy({ where: { user_id: user.id } });

  await User.destroy({ where: { id: user.id } });

  return { message: "User deleted successfully" };
};

const updateOtp = async (email, otp, expirationTime) => {
  try {
    if (process.env.USE_REDIS === "true") {
      await redisClient.set(
        `OTP_${email}`,
        JSON.stringify({ otp, expiresAt: expirationTime }),
        "EX",
        process.env.OTP_EXPIRATION_TIME || 36000
      );
    } else {
      otpStorage.set(email, { otp, expiresAt: expirationTime });
    }
  } catch (error) {
    console.error(`Error in UserRepository.updateOtp: ${error.message}`);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  const user = await User.findByPk(userId);
  console.log('user', user);


  if (!user) {
    throw new Error('User not found');
  }

  await user.update(updateData);

  return user;
};

const findByMobileAndOtp = async (email, otp) => {
  try {
    if (process.env.USE_REDIS === "true") {
      const otpData = JSON.parse(await redisClient.get(`OTP_${email}`));
      if (
        otpData &&
        otpData.otp === otp &&
        new Date() < new Date(otpData.expiresAt)
      ) {
        return await findUser({ email });
      }
    } else {
      const otpData = otpStorage.get(email);
      if (
        otpData &&
        otpData.otp === otp &&
        new Date() < new Date(otpData.expiresAt)
      ) {
        return await findUser({ email });
      }
    }
    return null;
  } catch (error) {
    console.error(
      `Error in UserRepository.findByMobileAndOtp: ${error.message}`
    );
    throw error;
  }
};

const clearOtp = async (email) => {
  try {
    if (process.env.USE_REDIS === "true") {
      await redisClient.del(`OTP_${email}`);
    } else {
      otpStorage.delete(email);
    }
  } catch (error) {
    console.error(`Error in UserRepository.clearOtp: ${error.message}`);
    throw error;
  }
};

const fetchUsersWithPagination = async ({
  page = 1,
  pageSize = 10,
  search = '',
  sort = 'createdAt',
  order = 'DESC',
  include = [],
}) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  const { Op } = require("sequelize");

  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;

  const where = {};

  if (search) {
    where[Op.or] = [
      { full_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    offset,
    limit: pageSize,
    include,
    order: [[sort, order.toUpperCase()]],
  });

  return {
    currentPage: page,
    pageSize,
    totalRecords: count,
    totalPages: Math.ceil(count / pageSize),
    rows,
  };
};

const profileComplete = async (requestBody, where) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }

  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { User } = await getAllModels(process.env.DB_TYPE);
  return await User.update(requestBody, { where: where });
};

const sendOtp = async (phone, full_name) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpCache.set(phone, { otp, full_name, expiresAt, lastSent: Date.now() });

  const { User } = await getAllModels(process.env.DB_TYPE);

  // Prevent duplicate
  let user = await User.findOne({ where: { phone } });
  if (user) throw new Error("Phone number already registered.");


  await sendWhatsAppOtp(phone, otp);
  await redisClient.set(`Sign_Up_OTP_${phone}`, otp, { EX: 600 });
  return { message: "OTP sent to WhatsApp number.", phone, otp };
};

const verifyOtp = async (phone, otp) => {
  const cache = otpCache.get(phone);

  if (!cache) throw new Error("No OTP sent to this phone, or OTP expired.");
  if (cache.otp !== otp) throw new Error("Invalid OTP.");
  if (Date.now() > cache.expiresAt) {
    otpCache.delete(phone);
    throw new Error("OTP expired. Please request a new one.");
  }

  const { User, UserRole, SubscriptionPlan, sequelize } = await getAllModels(process.env.DB_TYPE);

  let user = await User.findOne({ where: { phone } });
  if (!user) {
    const freePlan = await SubscriptionPlan.findOne({ where: { name: "Free" } });
    if (!freePlan) throw new Error("Default subscription plan not found.");
    if (!freePlan.stripe_price_id) throw new Error("Stripe price ID for Free plan is not set.");

    // 1. Create Stripe customer first
    let stripeCustomer, stripeSubscription;
    try {
      stripeCustomer = await stripe.customers.create({
        name: cache.full_name,
        phone: phone,
        // email: cache.email || undefined
      });

      // 2. Create Stripe subscription for "Free" plan
      stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: freePlan.stripe_price_id }],
        // Optionally set trial_period_days, metadata, etc.
      });

    } catch (stripeError) {
      throw new Error("Failed to create Stripe customer/subscription: " + stripeError.message);
    }

    // 3. If Stripe succeeded, create user in DB
    const transaction = await sequelize.transaction();
    try {
      user = await User.create(
        {
          phone,
          full_name: cache.full_name,
          subscription_plan_id: freePlan.id,
          stripe_customer_id: stripeCustomer.id,
          stripe_subscription_id: stripeSubscription.id, // <-- Save here!
        },
        { transaction }
      );
      await UserRole.create(
        { user_id: user.id, role_id: 2, created_at: new Date(), updated_at: new Date() },
        { transaction }
      );
      await transaction.commit();
    } catch (dbError) {
      await transaction.rollback();
      // Clean up Stripe customer and subscription
      try {
        await stripe.subscriptions.del(stripeSubscription.id);
        await stripe.customers.del(stripeCustomer.id);
      } catch (cleanupError) {
        console.error("Failed to clean up Stripe resources:", cleanupError.message);
      }
      throw new Error(dbError.message || "Failed to create user.");
    }
  }

  otpCache.delete(phone);

  const token = generateToken({ id: user.id, phone: user.phone });

  return {
    user: {
      id: user.id,
      phone: user.phone,
      full_name: user.full_name,
      stripe_customer_id: user.stripe_customer_id,
      stripe_subscription_id: user.stripe_subscription_id,
      subscription_plan_id: user.subscription_plan_id
    },
    token
  };
};


const signup = async (phone, full_name) => {
  const { User, UserRole, SubscriptionPlan, sequelize } = await getAllModels(process.env.DB_TYPE);

  // Prevent duplicate
  let user = await User.findOne({ where: { phone } });
  if (user) throw new Error("Phone number already registered.");

  // Find free plan (optional)
  const freePlan = await SubscriptionPlan.findOne({ where: { name: "Free" } });
  if (!freePlan) throw new Error("Default subscription plan not found.");

  // Create user in transaction
  const transaction = await sequelize.transaction();
  try {
    user = await User.create(
      { phone, full_name, subscription_plan_id: freePlan.id },
      { transaction }
    );
    await UserRole.create(
      { user_id: user.id, role_id: 2, created_at: new Date(), updated_at: new Date() },
      { transaction }
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message || "Failed to create user.");
  }

  // Now, send OTP outside of the transaction
  try {
    await sendOtp(phone);
  } catch (otpError) {
    // You might want to log this
    throw new Error("User created but failed to send OTP: " + otpError.message);
  }

  return { id: user.id, phone: user.phone, full_name: user.full_name };
};

const login = async (phone, otp) => {
  // You can allow login by verifying OTP for existing users
  return await exports.verifyOtp(phone, otp);
};

const resendOtp = async (phone) => {
  const cache = otpCache.get(phone);
  const now = Date.now();

  if (cache && cache.lastSent && (now - cache.lastSent < 60 * 1000)) {
    throw new Error("OTP already sent. Please wait before resending.");
  }

  const { User } = await getAllModels(process.env.DB_TYPE);
  let user = await User.findOne({ where: { phone } });
  if (user) throw new Error("Phone number already registered.");

  const otp = generateOtp();
  const full_name = cache?.full_name || null;
  const expiresAt = now + 5 * 60 * 1000;

  otpCache.set(phone, { otp, full_name, expiresAt, lastSent: now });

  await sendWhatsAppOtp(phone, otp);

  return { phone };
};

module.exports = {
  findUser,
  createUser,
  updateUserProfile,
  deleteUser,
  updateOtp,
  findByMobileAndOtp,
  clearOtp,
  fetchUsersWithPagination,
  profileComplete,
  login,
  signup,
  findById,
  sendOtp,
  verifyOtp,
  resendOtp
};
