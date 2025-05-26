const logsManager = require('../manager/log');

exports.createErrorLog = async (req, res) => {
  try {
    const data = await logsManager.create('error', req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllErrorLogs = async (req, res) => {
  try {
    const data = await logsManager.getAll('error');
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAccessLog = async (req, res) => {
  try {
    const data = await logsManager.create('access', req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllAccessLogs = async (req, res) => {
  try {
    const data = await logsManager.getAll('access');
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
