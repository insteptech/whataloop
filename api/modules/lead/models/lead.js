'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lead.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });

      Lead.belongsTo(models.Constants, {
        foreignKey: 'tag',
        onDelete: 'SET NULL'
      });
    }
  }
  Lead.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(150)
    },
    tag: {
      type: DataTypes.UUID,
      references: {
        model: "Constants",
        key: "id",
      },
    },
    status: {
      type: DataTypes.UUID,
      references: {
        model: "Constants",
        key: "id",
      },
    },
    source: {
      type: DataTypes.UUID,
      references: {
        model: "Constants",
        key: "id",
      },
    },
    notes: {
      type: DataTypes.TEXT
    },
    last_contacted: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Lead',
  });
  return Lead;
};