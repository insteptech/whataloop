const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business');

router.post('/', businessController.createBusiness);
router.get('/', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);

router.post('/request-otp', businessController.requestOtp);
// router.post('/verify-otp', businessController.verifyOtp);


router.post('/connect', businessController.connectBusiness);
router.post('/verify-otp', businessController.verifyOtp);
router.post('/update-info', businessController.updateInfo);
router.post('/welcome-message', businessController.setWelcomeMessage);
router.post('/resend-otp', businessController.resendOtp);
router.get('/check/:userId', businessController.checkBusinessByUserId);

module.exports = router;
