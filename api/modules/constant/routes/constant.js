const express = require("express");
const router = express.Router();
const constantController = require("../controllers/constant");
const { authenticate, authorize } = require("../../../middlewares/authenticate");

router.get("/types", constantController.getConstantType);
router.post("/constant", authenticate, constantController.create);
router.delete("/constantdelete/:id", authenticate, constantController.remove);



module.exports = router;