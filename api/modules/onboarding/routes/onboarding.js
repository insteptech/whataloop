const express = require("express");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();
const onboardingController = require('../controllers/onboarding');
const { sendTestWhatsAppMessage } = require('../utils/helper'); // Update the path

router.post('/onboard', onboardingController.onboardNewUser);
router.post('/business/:businessId/waba-onboarding', onboardingController.triggerWabaOnboarding);


router.post('/test-whatsapp', async (req, res) => {
  const { whatsappNumber } = req.body;

  try {
    await sendTestWhatsAppMessage({ whatsappNumber });
    return res.json({ success: true, message: 'Test WhatsApp message sent.' });
  } catch (err) {
    console.warn('Test WhatsApp message failed (ignored):', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send test WhatsApp message', error: err.message });
  }
});


module.exports = router;