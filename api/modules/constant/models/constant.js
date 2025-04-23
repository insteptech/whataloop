'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Constant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Constant.init({
    id: DataTypes.uuid,
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Constant',
  });
  return Constant;
};