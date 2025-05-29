'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ThirdPartyIntegration extends Model {
    static associate(models) {
      ThirdPartyIntegration.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
      });
    }
  }
  ThirdPartyIntegration.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    integration_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'ThirdPartyIntegration',
    tableName: 'thirdpartyintegrations',
    underscored: true,
    timestamps: true,
  });
  return ThirdPartyIntegration;
};
