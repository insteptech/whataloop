'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WebhookMessages', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique:true,
        primaryKey: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      leadId: {
        type: Sequelize.UUID,
        references: {
          model: 'Leads',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      messageType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WebhookMessages');
  },
};
