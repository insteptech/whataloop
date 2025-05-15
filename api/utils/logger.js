// utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'whatsapp.log');

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  try {
    fs.appendFileSync(logFile, logEntry);
    // Optional: also console it
    console.log(logEntry);
  } catch (err) {
    console.error('Logger error:', err);
  }
};

module.exports = {
  logToFile,
};
