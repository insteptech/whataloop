// Content for category.js

const categoryService = require("../services/category.js");
const { sendResponse } = require("../utils/helper.js");

exports.createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return sendResponse(
    res,
    200,
    true,
    "Category created successfully",
    category
  );
};

exports.updateCategory = async (req, res) => {
  const { id } = req.body;
  const category = await categoryService.updateCategory(req.body, {
    id,
  });
  return sendResponse(
    res,
    200,
    true,
    "Category Updated successfully",
    category
  );
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getCategory({ id });
  return sendResponse(res, 200, true, "Category detail successfully", category);
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.deleteCategory({ id });
  return sendResponse(
    res,
    200,
    true,
    "Category deleted successfully",
    category
  );
};

exports.listCategory = async (req, res) => {
  const category = await categoryService.listCategory();
  return sendResponse(
    res,
    200,
    true,
    "Category fetched successfully",
    category
  );
};
