'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Whatsapps', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), // Automatically generate UUID
        allowNull: false,
        primaryKey: true,
      },
      raw_payload: {
        type: Sequelize.JSONB, // Use JSONB to store raw payload
        allowNull: false, // Cannot be null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Whatsapps');
  }
};
