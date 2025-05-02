module.exports = (sequelize, DataTypes) => {
  const WebhookMessage = sequelize.define('WebhookMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    sender: DataTypes.TEXT,
    leadId: DataTypes.UUID,
    messageType: DataTypes.TEXT
  });

  WebhookMessage.associate = function(models) {
    WebhookMessage.belongsTo(models.Lead, { foreignKey: 'leadId' });
  };

  return WebhookMessage;
};
