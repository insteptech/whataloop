const express = require("express");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();
const onboardingController = require('../controllers/onboarding');

router.post('/onboard', onboardingController.onboardNewUser);

module.exports = router;