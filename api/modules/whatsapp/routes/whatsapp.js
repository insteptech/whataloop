const express = require("express");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();
const whatsappController = require('../controllers/whatsapp');


router.post('/webhook', whatsappController.incomingMessage);
router.get('/', whatsappController.verifyWebhook);
router.post('/', whatsappController.receiveMessage);
router.post('/send', whatsappController.sendMessage);

module.exports = router;