const replyManager = require('../manager/replies');
const { getUserIdFromToken } = require('../../../utils/helper');
;

exports.createReply = async (req, res) => {
    const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);
  if(!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const result = await replyManager.createReply(req.body, userId);
  res.status(result.status).json(result.data);
};

exports.getReplyById = async (req, res) => {
  const result = await replyManager.getReplyById(req.params.id);
  res.status(result.status).json(result.data);
};

exports.getReplies = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);
  if(!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const result = await replyManager.getReplies(userId);
  res.status(result.status).json(result.data);
};

exports.updateReply = async (req, res) => {
  const result = await replyManager.updateReply(req.params.id, req.body);
  res.status(result.status).json(result.data);
};

exports.deleteReply = async (req, res) => {
  const result = await replyManager.deleteReply(req.params.id);
  res.status(result.status).json(result.data);
};
