const express = require("express");
const { handleIncomingMessage } = require('../controllers/webhook');
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();

router.post('/message', handleIncomingMessage);


module.exports = router;