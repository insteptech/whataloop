const express = require("express");
const router = express.Router();
const controller = require("../controllers/businessSubscription");

router.post("/", controller.create);
router.get("/:id", controller.findById);
router.get("/business/:business_id", controller.findByBusiness);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
