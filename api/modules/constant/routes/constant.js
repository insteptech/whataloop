// Content for constant.js
const express = require("express");
const router = express.Router();
const constantController = require("../controllers/constant");
const { authenticate, authorize } = require("../../../middlewares/authenticate");

// router.get("/", console.log("constant"));
router.get("/types", constantController.getConstantType);


module.exports = router;