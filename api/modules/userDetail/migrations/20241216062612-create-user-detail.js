"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      auth_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["male", "female", "other"],
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      height: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      heightUnit: {
        type: Sequelize.ENUM,
        values: ["cm", "inch"],
        allowNull: false,
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weightUnit: {
        type: Sequelize.STRING,
        values: ["pounds", "stone", "kg"],
        allowNull: false,
      },
      waist: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      waistUnit: {
        type: Sequelize.STRING,
        values: ["cm", "inch"],
        allowNull: false,
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
    await queryInterface.dropTable("UserDetails");
  },
};
