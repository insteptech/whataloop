const express = require('express');
const router = express.Router();
const logsController = require('../controllers/log');

router.post('/error', logsController.createErrorLog);
router.get('/error', logsController.getAllErrorLogs);

router.post('/access', logsController.createAccessLog);
router.get('/access', logsController.getAllAccessLogs);

module.exports = router;
