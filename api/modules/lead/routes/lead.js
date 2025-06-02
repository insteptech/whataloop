const express = require("express");
const leadController = require("../controllers/lead");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const { validateCreateLead, validateUpdateLead } = require('../middlewares/validators');
const router = express.Router();

router.post("/add-lead", authenticate, leadController.addLead);

router.post('/', authenticate, validateCreateLead, leadController.create);
router.get('/', authenticate, leadController.getAll);
router.put('/:id', authenticate, validateUpdateLead, leadController.update);
router.delete('/:id', authenticate, leadController.remove);
// router.put('updateleadbyadmin/:id', authenticate, validateUpdateLead, leadController.updateLeadByAdmin)

// router.get('/:leadId/chat-thread', authenticate, leadsController.getLeadChatThread);
router.get('/:leadId/thread', authenticate, leadController.getLeadThread);


module.exports = router;