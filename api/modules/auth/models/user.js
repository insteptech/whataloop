"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Role) {
        // User has many Roles
        User.belongsToMany(models.Role, {
          through: models.UserRole, // Join table
          foreignKey: "userId", // Foreign key in the UserRole table
          as: "roles", // Alias for the roles
        });
      }
    }
  }
  User.init(
    {
      mobile: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isProfileComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      otp: DataTypes.STRING,
      otpExpires: DataTypes.DATE,
      uuid: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
