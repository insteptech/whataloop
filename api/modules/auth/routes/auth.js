const express = require("express");
const authController = require("../controllers/auth");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();
// router.get("/", authenticate, authController.listUsers);

// router.post("/send-otp", authController.sendOtp);
// router.post("/verify-otp", authController.verifyOtp);

// router.post("/login", authController.login);
// router.post("/signup", authController.signup);
// router.get("/:id", authenticate, authController.getUserDetails);
// router.put("/update", authenticate, authController.updateUser);
// router.delete("/:id", authenticate, authorize, authController.deleteUser);

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users", authenticate, authController.listUsers);
router.get('/profile', authenticate, authController.getMe);
router.get("/:id", authenticate, authController.getUserDetails);
router.put("/updateprofile", authenticate, authController.updateUserProfile);

router.put(
  "/complete",
  authenticate,
  // authorize,
  authController.profileComplete
);
module.exports = router;
