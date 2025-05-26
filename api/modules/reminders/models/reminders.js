'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reminders extends Model {
    static associate(models) {
      // A reminder belongs to a user and a lead
      Reminders.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
      Reminders.belongsTo(models.Lead, {
        foreignKey: 'id',
        as: 'lead',
        onDelete: 'CASCADE',
      });
    }
  }

  Reminders.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',  // Ensure model name matches the Users table name
        key: 'id',
      },
    },
    lead_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Leads',  // Ensure model name matches the Users table name
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT
    },
    due_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'  // options: pending, done, missed
    },
    sent_notification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    sequelize,
    modelName: 'Reminders',
    tableName: 'Reminders',
    underscored: true,
    timestamps: true
  });

  return Reminders;
};
