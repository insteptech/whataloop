const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");
const { Op } = require('sequelize');

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
  if (!User) {
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

const create = async (data) => {
  try {
    const { Lead } = await getAllModels(process.env.DB_TYPE);
    if (!Lead) {
      throw new Error("Lead model not found");
    }

    if (data.email) {
      const existingEmail = await Lead.findOne({ where: { email: data.email } });
      if (existingEmail) {
        throw new Error("Lead with this email already exists");
      }
    }

    if (data.phone) {
      const existingPhone = await Lead.findOne({ where: { phone: data.phone } });
      if (existingPhone) {
        throw new Error("Lead with this phone number already exists");
      }
    }

    const newLead = await Lead.create(data);
    return newLead;

  } catch (error) {
    console.error("Error in leadService.create:", error.message);
    throw error;
  }
};


const getAll = async (userId, query) => {
  const {
    search,
    tag,
    status,
    sort = 'createdAt',
    order = 'DESC',
    page = 1,
    limit = 10,
    role
  } = query;

  const { Lead, Constant } = await getAllModels(process.env.DB_TYPE);

  if (!Lead) {
    throw new Error("Lead model not found");
  }

  const where = {};


  if (role !== 'admin') {
    where.user_id = userId;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (tag) where.tag = tag;
  if (status) where.status = status;

  const result = await Lead.findAndCountAll({
    where,
    include: [
      { model: Constant, as: 'tagDetail', attributes: ['label'] },
      { model: Constant, as: 'statusDetail', attributes: ['label'] },
      { model: Constant, as: 'sourceDetail', attributes: ['label'] },
    ],
    order: [[sort, order.toUpperCase()]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  return result;
};


const update = async (id, userId,data, role) => {
  const { Lead } = await getAllModels(process.env.DB_TYPE);
  if (!Lead) {
    throw new Error("Lead model not found");
  }

  const lead = await Lead.findOne({ where: { id } });
  if (!lead) {
    throw new Error("Lead not found");
  }

  if (role !== 'admin' && lead.user_id !== userId) {
    throw new Error("Unauthorized: You do not have permission to update this lead");
  }

  return await lead.update(data);
};

const remove = async (id) => {
  const { Lead } = await getAllModels(process.env.DB_TYPE);
  if (!Lead) {
    throw new Error("Lead model not found");
  }
  const lead = await Lead.findOne({ where: { id } });
  if (!lead) throw new Error('Lead not found or unauthorized');
  await lead.destroy();
};


module.exports = {
  findUser,
  createUser,
  updateUser,
  deleteUser,
  updateOtp,
  login,
  create,
  getAll,
  update,
  remove,
};
