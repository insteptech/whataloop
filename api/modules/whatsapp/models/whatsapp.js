'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WhatsApp extends Model {}
  WhatsApp.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    raw_payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    }
  }, {
    sequelize,
    modelName: 'WhatsApp',
    tableName: 'whatsapps',
    underscored: true,
    timestamps: true,
  });
  return WhatsApp;
};
