'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      Lead.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Lead.belongsTo(models.Constant, {
        foreignKey: 'tag',
        as: 'tagConstant',
      });
      Lead.belongsTo(models.Constant, {
        foreignKey: 'status',
        as: 'statusConstant',
      });
      Lead.belongsTo(models.Constant, {
        foreignKey: 'source',
        as: 'sourceConstant',
      });
    }
  }
  Lead.init({
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
    tag: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'constants',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'constants',
        key: 'id',
      },
    },
    source: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'constants',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quality_label: {                     // <--- Add this block
      type: DataTypes.STRING,
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
    modelName: 'Lead',
    tableName: 'leads',
    underscored: true,
    timestamps: true,
  });
  return Lead;
};
