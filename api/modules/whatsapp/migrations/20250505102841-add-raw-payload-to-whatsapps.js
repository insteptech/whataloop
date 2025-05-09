'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Whatsapps', 'raw_payload', {
      type: Sequelize.JSONB, // Use JSONB for raw payload
      allowNull: false,
      defaultValue: {}, // Default to empty object
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Whatsapps', 'raw_payload');
  },
};
