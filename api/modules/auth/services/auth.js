const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();

const findUser = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { User, Role, Permission } = await getAllModels(process.env.DB_TYPE);
  let user = null;
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

  user = await User.findOne({
    // attributes: ["firstName"],
    where: where,
    include: includes,
  });

  return user;
};

const createUser = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { User, UserRole, sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();
  try {
    requestBody["uuid"] = uuidv4();
    const user = await User.create(requestBody, { transaction });
    await UserRole.create({ userId: user.id, roleId: 2 }, { transaction });
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateUser = async (requestBody, where) => {
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

const deleteUser = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { User } = await getAllModels(process.env.DB_TYPE);
  return await User.destroy({ where: where });
};

const updateOtp = async (mobile, otp, expirationTime) => {
  try {
    if (process.env.USE_REDIS === "true") {
      await redisClient.set(
        `OTP_${mobile}`,
        JSON.stringify({ otp, expiresAt: expirationTime }),
        "EX",
        process.env.OTP_EXPIRATION_TIME || 36000
      );
    } else {
      otpStorage.set(mobile, { otp, expiresAt: expirationTime });
    }
  } catch (error) {
    console.error(`Error in UserRepository.updateOtp: ${error.message}`);
    throw error;
  }
};

const findByMobileAndOtp = async (mobile, otp) => {
  try {
    if (process.env.USE_REDIS === "true") {
      const otpData = JSON.parse(await redisClient.get(`OTP_${mobile}`));
      if (
        otpData &&
        otpData.otp === otp &&
        new Date() < new Date(otpData.expiresAt)
      ) {
        return await findUser({ mobile });
      }
    } else {
      const otpData = otpStorage.get(mobile);
      if (
        otpData &&
        otpData.otp === otp &&
        new Date() < new Date(otpData.expiresAt)
      ) {
        return await findUser({ mobile });
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

const clearOtp = async (mobile) => {
  try {
    if (process.env.USE_REDIS === "true") {
      await redisClient.del(`OTP_${mobile}`);
    } else {
      otpStorage.delete(mobile);
    }
  } catch (error) {
    console.error(`Error in UserRepository.clearOtp: ${error.message}`);
    throw error;
  }
};

const fetchUsersWithPagination = async ({
  page = 1,
  pageSize = 10,
  include = [],
}) => {
  const { User } = await getAllModels(process.env.DB_TYPE);
  // Ensure page and pageSize are numbers
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Fetch data with pagination and associations
  const { count, rows } = await User.findAndCountAll({
    offset,
    limit,
    include,
  });

  // Return paginated results
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

module.exports = {
  findUser,
  createUser,
  updateUser,
  deleteUser,
  updateOtp,
  findByMobileAndOtp,
  clearOtp,
  fetchUsersWithPagination,
  profileComplete,
};
