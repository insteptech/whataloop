const express = require("express");
const authController = require("../controllers/auth");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get("/", authenticate, authController.listUsers);

router.get("/:id", authenticate, authController.getUserDetails);

router.put("/update", authenticate, authController.updateUser);

router.delete("/:id", authenticate, authorize, authController.deleteUser);
router.put(
  "/complete",
  authenticate,
  // authorize,
  authController.profileComplete
);
module.exports = router;
