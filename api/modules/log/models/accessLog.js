'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccessLog extends Model {
    static associate(models) {
      // AccessLog.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  AccessLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING
    },
    device_info: {
      type: DataTypes.STRING
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'AccessLog',
    tableName: 'access_logs',
    timestamps: false
  });

  return AccessLog;
};
