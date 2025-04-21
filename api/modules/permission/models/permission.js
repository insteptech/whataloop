"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A permission can be associated with multiple roles
      if (models.Role) {
        Permission.belongsToMany(models.Role, {
          through: models.RolePermission,
          foreignKey: "permissionId",
          as: "permissions",
        });
      }
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      route: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM("backend", "frontend"),
        allowNull: false,
        defaultValue: "backend",
      },
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
