const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replies');
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

router.post('/', authenticate, replyController.createReply);
router.get('/:id', authenticate, replyController.getReplyById);
router.get('/', authenticate, replyController.getReplies);
router.put('/:id', authenticate, replyController.updateReply);
router.delete('/:id', authenticate, replyController.deleteReply);

module.exports = router;
