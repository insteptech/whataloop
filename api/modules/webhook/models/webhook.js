// modules/webhook/models/webhook.js

'use strict';
module.exports = (sequelize, DataTypes) => {
  const WebhookMessage = sequelize.define('WebhookMessage', {
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Leads',  // Ensure Leads model is referenced here
        key: 'id',
      },
      onDelete: 'CASCADE',  // If Lead is deleted, related messages will be deleted
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
      type: DataTypes.STRING, // Can be 'text', 'image', etc.
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
