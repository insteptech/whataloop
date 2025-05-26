const replyService = require('../services/replies');

exports.createReply = async (data, userId) => {
  return await replyService.create(data, userId);
};

exports.getReplyById = async (id) => {
  return await replyService.findById(id);
};

exports.getReplies = async (userId) => {
  return await replyService.findAllByUser(userId);
};

exports.updateReply = async (id, data) => {
  return await replyService.update(id, data);
};

exports.deleteReply = async (id) => {
  return await replyService.remove(id);
};
