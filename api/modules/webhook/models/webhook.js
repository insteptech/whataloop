'use strict';
module.exports = (sequelize, DataTypes) => {
  const WebhookMessage = sequelize.define('WebhookMessage', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Leads',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING, // 'text', 'image', etc.
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'sent',
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {});

  WebhookMessage.associate = function(models) {
    WebhookMessage.belongsTo(models.Lead, {
      foreignKey: 'leadId',
      as: 'lead',
    });
  };

  return WebhookMessage;
};
