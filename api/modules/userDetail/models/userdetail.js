"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User, {
        foreignKey: "auth_user_id",
        as: "user", // Alias for the relation
      });
      UserDetail.hasMany(models.Address, {
        foreignKey: "user_detail_id",
        as: "address", // Alias for the relation
      });
      UserDetail.hasMany(models.ScanHistory, {
        foreignKey: "user_detail_id",
        as: "scanHistory", // Alias for the relation
      });
    }
  }
  UserDetail.init(
    {
      auth_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female", "other"],
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      height: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      heightUnit: {
        type: DataTypes.STRING,
        values: ["cm", "inch"],
        allowNull: false,
      },
      weight: {
        type: DataTypes.STRING,
        values: ["pounds", "stone", "kg"],
        allowNull: false,
      },
      waist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weightUnit: {
        type: DataTypes.STRING,
        values: ["cm", "inch"],
        allowNull: false,
      },
      waistUnit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserDetail",
    }
  );
  return UserDetail;
};
