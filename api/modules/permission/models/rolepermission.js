"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      if (models.Permission) {
        RolePermission.belongsTo(models.Permission, {
          foreignKey: "permissionId",
          as: "permission",
        });
      }
      if (models.Role) {
        RolePermission.belongsTo(models.Role, {
          foreignKey: "roleId",
          as: "role",
        });
      }
    }
  }
  RolePermission.init(
    {
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Permission",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Role",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};
