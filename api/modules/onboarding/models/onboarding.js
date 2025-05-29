// modules/onboarding/models/onboarding.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Onboarding extends Model {
    static associate(models) {
      Onboarding.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
      });
    }
  }

  Onboarding.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    whatsapp_number: {   // << ADD THIS
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
  }, {
    sequelize,
    modelName: 'Onboarding',
    tableName: 'onboardings',
    underscored: true,
    timestamps: true,
  });

  return Onboarding;
};
