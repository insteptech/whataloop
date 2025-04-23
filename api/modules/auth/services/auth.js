const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");

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

  const user = await User?.findOne({
    where: sanitizedWhere,
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
  if(!User) {
    throw { message: "User model not found" };
  }  
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

const login = async (email, password) => {
  try {
    const user = await findUser({ email: email.toLowerCase() });

    if (!user) {
      throw { status: 401, message: "Invalid email or password" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Invalid email or password" };
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   fullName: user.fullName,
      //   roles: user.roles || [],
      // },
    };

  } catch (error) {
    console.error(
      `Error in UserRepository.findByMobileAndOtp: ${error.message}`
    );
    throw error;
  }
};

const signup = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { User, sequelize } = await getAllModels(process.env.DB_TYPE);
  const transaction = await sequelize.transaction();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(requestBody.password, salt);

  try {
    requestBody.email = requestBody.email.toLowerCase();
    requestBody["uuid"] = uuidv4();
    requestBody.password = hashedPassword;
    requestBody["isActive"] = true;

    const user = await User.create(requestBody, { transaction });

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
  updateUser,
  deleteUser,
  updateOtp,
  findByMobileAndOtp,
  clearOtp,
  fetchUsersWithPagination,
  profileComplete,
  login,
  signup
};
