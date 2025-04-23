'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Constants', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUID,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      type: {
        type: Sequelize.STRING,
        unique: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Constants');
  }
};