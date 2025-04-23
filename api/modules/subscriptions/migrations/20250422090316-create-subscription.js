'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUID,
        unique: true,
      },
      name: {
        type: Sequelize.ENUM("free", "starter", "pro"),
        defaultValue: "free",
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Subscriptions');
  }
};