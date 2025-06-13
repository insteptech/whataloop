'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Onboarding extends Model {
    static associate(models) {
      Onboarding.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
      });

      Onboarding.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    waba_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    waba_phone_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    raw_payload: {
      type: DataTypes.JSONB,
      allowNull: true,
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
