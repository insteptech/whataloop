'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create onboardings table
    await queryInterface.createTable('onboardings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      whatsapp_number: { // <-- Added here!
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: '', // Remove default if you don't need it!
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('onboardings');
  },
};
