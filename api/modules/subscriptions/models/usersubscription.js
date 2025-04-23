'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserSubscription.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      UserSubscription.belongsTo(models.Subscriptions, {
        foreignKey: 'plan',
      });
    }
  }
  UserSubscription.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(100),
    },
    plan: {
      references: {
        model: "Subscriptions",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "canceled", "trialing"),
      defaultValue: "trialing",
    },
    started_at: {
      type: DataTypes.DATE,
    },
    ended_at: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'UserSubscription',
  });
  return UserSubscription;
};