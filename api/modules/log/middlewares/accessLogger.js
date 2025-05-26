// middlewares/accessLogger.js
const logsService = require('../services/log');

const accessLogger = async (req, res, next) => {
  try {
    await logsService.create('access', {
      user_id: req.user?.id || null,  // assuming user info is set in req.user after auth middleware
      action: `${req.method} ${req.originalUrl}`,
      ip_address: req.ip,
      device_info: req.headers['user-agent'],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
  next();
};

module.exports = accessLogger;
