const { getAllModels } = require("../../../middlewares/loadModels");
const redisClient = require("../../../config/redis");
const axios = require('axios');

const { v4: uuidv4 } = require("uuid");
const otpStorage = new Map();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");
const { Op } = require('sequelize');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const DEFAULT_TAG_ID = process.env.DEFAULT_TAG_ID;
const DEFAULT_STATUS_ID = process.env.DEFAULT_STATUS_ID;

const sendTextMessage = async (toPhone, messageText) => {

  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error('WhatsApp API credentials are not set.');
  }

  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone.replace('+', ''),
    type: 'text',
    text: { body: messageText },
  };

  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {    
    const { data } = await axios.post(url, payload, { headers });
    return data;
  } catch (error) {
    console.error('Error sending message to WhatsApp API:', error);
    throw error;
  }
};


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
    if (!Lead) throw new Error("Lead model not found");

    // Validate required fields
    const required = ['user_id', 'tag', 'status', 'source', 'name'];
    required.forEach(key => {
      if (!data[key]) throw new Error(`${key} is required`);
    });

    // Log data
    console.log("Lead data before insert:", data);

    // Check for duplicate (should be phone+user_id)
    if (data.phone) {
      const existingPhone = await Lead.findOne({ where: { phone: data.phone, user_id: data.user_id } });
      if (existingPhone) {
        throw new Error("Lead with this phone number already exists for this user");
      }
    }
    
    console.log("About to insert lead with data:", data);

    const newLead = await Lead.create(data);
    return newLead;
  } catch (error) {
    console.error("Error in leadService.create:", error); // log full error!
    if (error.parent) {
      console.error("Postgres error details:", error.parent);
    }
    throw error;
  }
};

const getAll = async (userId, query) => {
  const {
    search,
    tag,
    status,
    sort = 'updatedAt',
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
      { model: Constant, as: 'tagConstant', attributes: ['label'] },
      { model: Constant, as: 'statusConstant', attributes: ['label'] },
      { model: Constant, as: 'sourceConstant', attributes: ['label'] },
    ],
    order: [[sort, order.toUpperCase()]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  return result;
};


const update = async (id, userId, data, role) => {
  const { Lead } = await getAllModels(process.env.DB_TYPE);

  const where = { id };
  if (role !== 'admin') {
    where.user_id = userId; // Only filter by user if not admin
  }

  const [affectedCount, affectedRows] = await Lead.update(data, {
    where,
    returning: true
  });

  if (affectedCount === 0) {
    throw new Error("Lead not found or no changes made");
  }

  return affectedRows[0];
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

const getLeadThread = async (leadId, userId) => {
  const { Lead, Message, User } = await getAllModels(process.env.DB_TYPE);

  // 1. Get Lead details
  const lead = await Lead.findOne({
    where: { id: leadId },
  });

  if (!lead) throw new Error('Lead not found');

  // 2. Get the user's phone number (if userId is your business user)
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const userPhone = user.phone;

  // 3. Get Message history (ordered by timestamp)
  const messages = await Message.findAll({
    where: { lead_id: leadId },
    order: [['timestamp', 'ASC']],
    attributes: [
      'id',
      'lead_id',
      'sender_phone_number',
      'receiver_phone_number',
      'message_content',
      'message_type',
      'timestamp',
      'status'
    ],
  });

  // 4. Format messages with isSentByUser helper
  const chatMessages = messages.map(msg => ({
    id: msg.id,
    lead_id: msg.lead_id,
    sender: msg.sender_phone_number,
    receiver: msg.receiver_phone_number,
    content: msg.message_content,
    type: msg.message_type, // 'incoming' or 'outgoing'
    timestamp: msg.timestamp,
    status: msg.status,
    isSentByUser: msg.sender_phone_number === userPhone
  }));

  return {
    lead,
    messages: chatMessages,
  };
};

const createIfNotExists = async ({
  phone,
  full_name,
  source,
  user_id,
  tag = DEFAULT_TAG_ID,
  status = DEFAULT_STATUS_ID,
  last_message,
  email = null,
  notes = null,
  qualityLabel = null,
  timestamp = Date.now().toString(),
  receiverNumber = null
}) => {
  const { Lead, Message, Business } = await getAllModels(process.env.DB_TYPE);

  // Validate required fields
  if (!phone) throw new Error('Phone is required');
  if (!user_id) throw new Error('user_id is required');
  if (!source) throw new Error('source is required');
  if (!tag) throw new Error('tag is required');
  if (!status) throw new Error('status is required');
  if (!full_name) throw new Error('full_name (lead name) is required');

  console.log("Lead.create with:", {
    user_id, tag, status, source, name: full_name, phone, email, notes: last_message || notes
  });

  try {
    // Check for duplicate by phone + user_id
    const existing = await Lead.findOne({ where: { phone, user_id } });
    if (existing) return existing;

    // Create lead
    const lead = await Lead.create({
      user_id,
      tag,
      status,
      source,
      name: full_name,
      phone,
      email,
      notes: last_message || notes,
      quality_label: qualityLabel
    });

    // Fetch welcome message from business table
    let welcomeMessage = 'Thank you for contacting us! We have received your inquiry and will get back to you soon.';
    const business = await Business.findOne({ where: { user_id } });
    if (business?.welcome_message) {
      welcomeMessage = business.welcome_message;
    }

    // Send welcome message
    sendTextMessage(phone, welcomeMessage).catch(console.error);

    // Create initial message
    await Message.create({
      lead_id: lead.id,
      sender_phone_number: phone,
      receiver_phone_number: receiverNumber,
      message_content: last_message,
      message_type: 'incoming',
      timestamp,
      status: 'sent',
      quality_label: qualityLabel,
    });

    return lead;

  } catch (error) {
    console.error("Error in createIfNotExists:", error);
    if (error.parent) {
      console.error("Postgres error details:", error.parent);
    }
    throw error;
  }
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
  getLeadThread,
  createIfNotExists
};
