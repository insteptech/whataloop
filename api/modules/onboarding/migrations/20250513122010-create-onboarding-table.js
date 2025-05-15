'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Onboardings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      business_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      whatsapp_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active',
      },
      raw_payload: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Onboardings');
  }
};
