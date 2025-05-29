const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");
const User = require("../models/user");
const stripe = require('../../../utils/stripe');

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
    attributes: ['id', 'fullName', 'email', 'phone', 'photo_url', 'account_type', 'timezone'],
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

  // First delete related UserRoles
  await UserRole.destroy({ where: { userId: user.id } });

  // Then delete the user
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
      { fullName: { [Op.iLike]: `%${search}%` } },
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

const login = async (email, password, id) => {
  try {
    const user = await findUser({ email: email.toLowerCase() });
    const { UserRole, Role } = await getAllModels(process.env.DB_TYPE);

    if (!user) {
      throw { status: 401, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Invalid email or password" };
    }

    const userRole = await UserRole.findOne({
      where: { user_id: user.id },
      attributes: ["role_id"],
    });
    if (!userRole || userRole.length === 0) {
      throw { status: 401, message: "User has no roles assigned" };
    }
    const roleId = userRole.role_id;

    const role = await Role.findOne({
      where: { id: roleId },
      attributes: ["name"],
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: role.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    throw error;
  }
};

// FIXED: use user_id and role_id
const signup = async (requestBody) => {
const { User, UserRole, SubscriptionPlan, sequelize } = await getAllModels(process.env.DB_TYPE);

  const transaction = await sequelize.transaction();
  try {
    // 1. Find the Free plan (ensure the plan exists!)
    const freePlan = await SubscriptionPlan.findOne({
      where: { name: "Free" },
      transaction,
    });
    if (!freePlan) throw new Error("Default subscription plan not found");

    // 2. Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: requestBody.email,
      name: requestBody.fullName || requestBody.full_name || "",
      phone: requestBody.phone,
    });

    // 3. ⭐️ Create Stripe Subscription for that customer ⭐️
    // This step is what you are missing!
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: freePlan.stripe_price_id }],
      // If you want, set trial_period_days or other subscription options here
    });

    // 4. Add Stripe/customer/subscription IDs and plan to user
    requestBody.subscription_plan_id = freePlan.id;
    requestBody.stripe_customer_id = stripeCustomer.id;
    requestBody.stripe_subscription_id = stripeSubscription.id; // Add this field in your user model/migration if not present

    // 5. Create user
    const user = await User.create(requestBody, { transaction });

    // 6. Assign default user role
    await UserRole.create(
      { user_id: user.id, role_id: 2, created_at: new Date(), updated_at: new Date() },
      { transaction }
    );

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
};
