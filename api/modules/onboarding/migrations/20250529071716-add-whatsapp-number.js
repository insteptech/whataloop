'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('onboardings', 'whatsapp_number', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '', // Temporarily, if you have old data; remove if fresh DB
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('onboardings', 'whatsapp_number');
  },
};
