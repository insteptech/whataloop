'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    static associate(models) {
      SubscriptionPlan.hasMany(models.BusinessSubscription, {
        foreignKey: 'plan_id',
        as: 'businessSubscriptions',
        onDelete: 'CASCADE',
      });
      SubscriptionPlan.hasMany(models.User, {
        foreignKey: 'subscription_plan_id',
        as: 'users',
      });
    }
  }
  SubscriptionPlan.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('features');
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue('features', JSON.stringify(value));
      }
    },
    max_users: {
      type: DataTypes.INTEGER,
    },
    max_leads: {
      type: DataTypes.INTEGER,
    },
    max_messages_per_month: {
      type: DataTypes.INTEGER,
    },
    stripe_product_id: {
      type: DataTypes.STRING,
    },
    stripe_price_id: {
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
    modelName: 'SubscriptionPlan',
    tableName: 'subscriptionplans',
    underscored: true,
    timestamps: true,
  });
  return SubscriptionPlan;
};
