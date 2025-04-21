"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Categories.hasMany(models.Categories, {
        foreignKey: "parentId",
        as: "subcategories",
      });
    }
  }
  Categories.init(
    {
      name: DataTypes.STRING,
      parentId: {
        type: DataTypes.INTEGER,
        references: { model: "Categories", key: "id" },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Categories",
    }
  );
  return Categories;
};
