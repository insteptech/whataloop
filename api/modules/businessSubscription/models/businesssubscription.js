'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessSubscription extends Model {
    static associate(models) {
      BusinessSubscription.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
        onDelete: 'CASCADE',
      });

      BusinessSubscription.belongsTo(models.SubscriptionPlan, {
        foreignKey: 'plan_id',
        as: 'subscription_plan',
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessSubscription.init({
    subscription_id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Businesses', // ✅ points to correct table
        key: 'id',           // ✅ primary key in Businesses
      },
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'SubscriptionPlans', // ✅ points to correct table
        key: 'id',                  // ✅ primary key in SubscriptionPlans
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
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
    modelName: 'BusinessSubscription',
    tableName: 'BusinessSubscriptions',
    underscored: true,
    timestamps: true,
  });

  return BusinessSubscription;
};
