'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ThirdPartyIntegration extends Model {
    static associate(models) {
      // Assuming belongs to Business or User
      ThirdPartyIntegration.belongsTo(models.Business, { foreignKey: 'business_id', onDelete: 'CASCADE' });
    }
  }

  ThirdPartyIntegration.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'ThirdPartyIntegration',
    tableName: 'ThirdPartyIntegrations',
    timestamps: true,
  });

  return ThirdPartyIntegration;
};
