'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Business.hasMany(models.BusinessSubscription, {
        foreignKey: 'business_id',
        as: 'subscriptions',
      });
      Business.hasMany(models.ThirdPartyIntegration, {
        foreignKey: 'business_id',
        as: 'integrations',
      });
      Business.hasMany(models.Onboarding, {
        foreignKey: 'business_id',
        as: 'onboardings',
      });
    }
  }
  Business.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    // NEW FIELDS FOR ONBOARDING & FLOW
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // 'pending', 'verified', 'onboarded'
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    welcome_message: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Business',
    tableName: 'businesses',
    underscored: true,
    timestamps: true,
  });
  return Business;
};
