"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.User) {
        Role.belongsToMany(models.User, {
          through: models.UserRole, // Join table
          foreignKey: "roleId", // Foreign key in the UserRole table
          as: "users", // Alias for the users
        });
      }
      if (models.Permission) {
        Role.belongsToMany(models.Permission, {
          through: models.RolePermission,
          foreignKey: "roleId",
          as: "permissions",
        });
      }
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
