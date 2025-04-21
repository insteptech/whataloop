"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReportHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserDetails",
          key: "id",
        },
      },
      heart_rate: {
        type: Sequelize.STRING,
      },
      blood_glucose: {
        type: Sequelize.STRING,
      },
      spo2: {
        type: Sequelize.STRING,
      },
      hrv: {
        type: Sequelize.STRING,
      },
      bmi: {
        type: Sequelize.STRING,
      },
      blood_pressure: {
        type: Sequelize.STRING,
      },
      mood: {
        type: Sequelize.STRING,
      },
      fatigue: {
        type: Sequelize.STRING,
      },
      overall_health: {
        type: Sequelize.STRING,
      },

      error: {
        type: Sequelize.STRING,
      },
      accuracy: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("ReportHistories");
  },
};
