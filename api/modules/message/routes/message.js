const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');

router.post('/', messageController.createMessage);
router.get('/lead/:lead_id', messageController.getMessagesByLead);
router.get('/:id', messageController.getMessageById);

module.exports = router;
