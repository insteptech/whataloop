
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      // Associations to Constants (tag, status, source)
      Lead.belongsTo(models.Constant, {
        foreignKey: 'tag',
        as: 'tagDetail',
        onDelete: 'SET NULL',
      });

      Lead.belongsTo(models.Constant, {
        foreignKey: 'status',
        as: 'statusDetail',
        onDelete: 'SET NULL',
      });

      Lead.belongsTo(models.Constant, {
        foreignKey: 'source',
        as: 'sourceDetail',
        onDelete: 'SET NULL',
      });

      // Associate Lead with User
      Lead.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });

      // Associating Lead with WebhookMessage
      Lead.hasMany(models.WebhookMessage, {
        foreignKey: 'leadId',
        as: 'messages',
      });
    }
  }

  Lead.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      tag: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Constants',  // Ensure model name matches the Constants table name
          key: 'id',
        },
      },
      status: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Constants',  // Ensure model name matches the Constants table name
          key: 'id',
        },
      },
      source: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Constants',  // Ensure model name matches the Constants table name
          key: 'id',
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_contacted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',  // Ensure model name matches the Users table name
          key: 'id',
        },
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Lead',
    }
  );

  return Lead;
};
