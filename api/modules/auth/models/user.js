'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
        as: 'roles',
      });
      User.belongsTo(models.SubscriptionPlan, {
        foreignKey: 'subscription_plan_id',
        as: 'subscriptionPlan',
      });
      User.hasMany(models.Business, {
        foreignKey: 'user_id',
        as: 'businesses',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otp_expires: {
      type: DataTypes.DATE,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    photo_url: {
      type: DataTypes.STRING,
    },
    account_type: {
      type: DataTypes.ENUM('free', 'starter', 'pro'),
      defaultValue: 'free',
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
    },
    subscription_plan_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'subscriptionplans',
        key: 'id',
      },
    },
    subscription_status: {
      type: DataTypes.ENUM('active', 'inactive', 'canceled', 'trialing', 'past_due'),
      defaultValue: 'active',
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
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
  });
  return User;
};
