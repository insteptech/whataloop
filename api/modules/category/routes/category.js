// Content for category.js
const express = require("express");
const categoryController = require("../controllers/category");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();

router.post(
  "/create",
  authenticate,
  authorize,
  categoryController.createCategory
);

router.put(
  "/update/:id",
  authenticate,
  authorize,
  categoryController.updateCategory
);

router.get("/:id", authenticate, authorize, categoryController.getCategory);
router.delete(
  "/:id",
  authenticate,
  authorize,
  categoryController.deleteCategory
);
router.get("/", authenticate, authorize, categoryController.listCategory);

module.exports = router;
