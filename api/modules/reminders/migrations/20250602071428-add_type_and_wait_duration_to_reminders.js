'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reminders', 'type', {
      type: Sequelize.ENUM('manual', 'wait_for_reply'),
      allowNull: false,
      defaultValue: 'manual'
    });
    await queryInterface.addColumn('reminders', 'wait_duration_minutes', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('reminders', 'type');
    await queryInterface.removeColumn('reminders', 'wait_duration_minutes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reminders_type";');
  }
};