"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.UserDetail, {
        foreignKey: "user_detail_id",
        as: "userDetail", // Alias for the relation
      });
    }
  }
  Address.init(
    {
      user_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UserDetails",
          key: "id",
        },
      },
      country: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      zip: {
        type: DataTypes.STRING,
      },
      lat: {
        type: DataTypes.STRING,
      },
      lng: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
