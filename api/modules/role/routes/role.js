const express = require("express");
const roleController = require("../controllers/role");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();

router.post("/create", authenticate, authorize, roleController.createRole);

module.exports = router;
