'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      Lead.belongsTo(models.Constants, {
        foreignKey: 'tag',
        onDelete: 'SET NULL'
      });

      Lead.belongsTo(models.Constants, {
        foreignKey: 'status',
        onDelete: 'SET NULL'
      });

      Lead.belongsTo(models.Constants, {
        foreignKey: 'source',
        onDelete: 'SET NULL'
      });

      // ✅ Associate Lead with User
      Lead.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });
    }
  }

  Lead.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tag: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Constants',
        key: 'id',
      }
    },
    status: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Constants',
        key: 'id',
      }
    },
    source: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Constants',
        key: 'id',
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_contacted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // ✅ Add user_id field
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Lead',
    tableName: 'Leads'
  });

  return Lead;
};
