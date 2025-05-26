// middlewares/errorLogger.js
const logsService = require('../services/log');

const errorLogger = async (err, req, res, next) => {
  try {
    await logsService.create('error', {
      message: err.message,
      error_type: err.name,
      stack_trace: err.stack,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorLogger;
