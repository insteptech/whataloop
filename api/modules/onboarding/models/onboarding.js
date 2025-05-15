'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Onboarding extends Model {
    static associate(models) {
      // optional: define associations here
    }
  }

  Onboarding.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profile_status: {
      type: DataTypes.STRING,
      defaultValue: 'inactive',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
  }, {
    sequelize,
    modelName: 'Onboarding',
    tableName: 'Onboardings',
  });

  return Onboarding;
};
