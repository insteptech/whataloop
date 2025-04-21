// Content for category.js
const { getAllModels } = require("../../../middlewares/loadModels");

const createCategory = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { Categories } = await getAllModels(process.env.DB_TYPE);
  return await Categories.create(requestBody);
};

const updateCategory = async (requestBody, where) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }

  delete requestBody.id;
  const { Categories } = await getAllModels(process.env.DB_TYPE);
  return await Categories.update(requestBody, { where: where });
};

const getCategory = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { Categories } = await getAllModels(process.env.DB_TYPE);
  return await Categories.findOne({
    where: where,
    include: [{ model: Categories, as: "subcategories" }],
  });
};

const deleteCategory = async (where) => {
  try {
    if (typeof where !== "object" || Object.keys(where).length === 0) {
      throw { message: "Invalid where condition" };
    }
    const { Categories } = await getAllModels(process.env.DB_TYPE);
    return await Categories.destroy({ where: where });
  } catch (error) {
    console.error(
      `Error in CategoryRepository.deleteCategory: ${error.message}`
    );
    throw error;
  }
};

const listCategory = async () => {
  try {
    const { Categories } = await getAllModels(process.env.DB_TYPE);
    return await Categories.findAll({
      where: { parentId: null },
      include: [{ model: Categories, as: "subcategories" }],
    });
  } catch (error) {
    console.error(
      `Error in CategoryRepository.listCategories: ${error.message}`
    );
    throw error;
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  listCategory,
};
