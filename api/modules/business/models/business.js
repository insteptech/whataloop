'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      // Business belongs to User
      Business.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'owner',
        onDelete: 'CASCADE',
      });

      // Business has many BusinessSubscriptions
      Business.hasMany(models.BusinessSubscription, {
        foreignKey: 'business_id',
        as: 'subscriptions',
        onDelete: 'CASCADE',
      });

      // Business has many ThirdPartyIntegrations
      Business.hasMany(models.ThirdPartyIntegration, {
        foreignKey: 'business_id',
        as: 'integrations',
        onDelete: 'CASCADE',
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
        model: 'Users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
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
    modelName: 'Business',
    tableName: 'Businesses',
    underscored: true,
    timestamps: true,
  });

  return Business;
};
