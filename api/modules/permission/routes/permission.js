const express = require("express");
const permissionController = require("../controllers/permission");

const router = express.Router();

router.post("/create", permissionController.create);

module.exports = router;
