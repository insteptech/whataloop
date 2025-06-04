const express = require("express");
const authController = require("../controllers/auth");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const upload = require('../utils/multer');


const router = express.Router();

router.get("/users", authenticate, authController.listUsers);
router.get('/profile', authenticate, authController.getMe);
router.get("/:id", authenticate, authController.getUserDetails);
router.put("/updateprofileself", upload.single("photo"), authenticate, authController.updateUserProfile);
router.delete("/deleteuser/:id", authenticate, authController.deleteUser)
router.put('/updateprofilebyadmin/:id', authenticate, authController.updateProfileByAdmin)


// router.post("/send-otp", authController.sendOtp);
// router.post("/verify-otp", authController.verifyOtp);
// router.post("/signup", authController.signup);
// router.post("/login", authController.login);
// router.post("/resend-otp", authController.resendOtp);

router.post("/signup", authController.signup);         // send OTP for new user
router.post("/login", authController.login);           // send OTP for existing user
router.post("/verify-otp", authController.verifyOtp);  // verify OTP, signup/login
router.post("/resend-otp", authController.resendOtp);  // resend OTP


router.put(
  "/complete",
  authenticate,
  // authorize,
  authController.profileComplete
);
module.exports = router;
