const e = require("express");
const leadService = require("../services/lead.js");
const {
  sendResponse,
  generateOtp,
  generateAccessToken,
  sendOtp,
} = require("../utils/helper.js");

exports.sendOtp = async (email) => {
  const otp = process.env.TEST_OTP;

  const user = await leadService.findUser(email);
  if (user) {
    console.log(`User already exists with email ${email}`);
  } else {
    console.log(`OTP is ${process.env.TEST_OTP} for ${email.email}`);
  }
  return { email, otp };
};

exports.addLead = async (req, res) => {
  const { phone, email, fullName, tag, status, source, notes, last_contacted } = req.body;

  user = await leadService.addLead({
    phone,
    email,
    fullName,
    tag,
    status,
    source,
    notes,
    last_contacted
  });

  return sendResponse(res, 200, true, "User successfully created", {
    id: user.id,
    phone: user.phone,
    email: user.email,
    fullName: user.fullName,
  });
};

exports.createLead = async (data, userId) => {
  if (!userId) throw new Error("User ID is required");
  return await leadService.create({ ...data, user_id: userId });
};

exports.getLeads = async (userId, query) => {
  return await leadService.getAll(userId, query);
};

exports.updateLead = async (leadId, userId, data, role) => {
  return await leadService.update(leadId, userId, data, role);
};

exports.deleteLead = async (leadId) => {
  return await leadService.remove(leadId);
};