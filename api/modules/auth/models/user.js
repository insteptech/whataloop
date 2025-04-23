"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
      phone: DataTypes.STRING,
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      otp: DataTypes.STRING,
      otpExpires: DataTypes.DATE,
      timezone: DataTypes.STRING,
      photo_url: DataTypes.STRING,
      account_type: {
        type: DataTypes.ENUM("free", "starter", "pro"),
        defaultValue: "free",
      },
      stripe_customer_id: DataTypes.STRING,
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
