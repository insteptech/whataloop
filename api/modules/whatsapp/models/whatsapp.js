'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Whatsapp extends Model {
    static associate(models) {
      // optional: add associations later
    }
  }

  Whatsapp.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    raw_payload: {
      type: DataTypes.JSONB, // ✅ Changed from TEXT to JSONB
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Whatsapp',
  });

  return Whatsapp;
};
