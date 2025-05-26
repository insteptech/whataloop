'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    static associate(models) {
      // No associations yet
    }
  }

  ErrorLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    error_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stack_trace: {
      type: DataTypes.TEXT
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ErrorLog',
    tableName: 'error_logs',
    timestamps: false
  });

  return ErrorLog;
};
