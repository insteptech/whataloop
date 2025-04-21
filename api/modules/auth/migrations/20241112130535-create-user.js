"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mobile: { type: Sequelize.STRING, allowNull: false, unique: true },
      firstName: { type: Sequelize.STRING, allowNull: true },
      lastName: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true, unique: true },
      password: { type: Sequelize.STRING, allowNull: true },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isProfileComplete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      otp: { type: Sequelize.STRING, allowNull: true },
      otpExpires: { type: Sequelize.DATE, allowNull: true },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUID,
        unique: true,
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
    // const tableDescription = await queryInterface.describeTable("Users");

    // Check if the column already exists
    // if (!tableDescription.uuid) {
    //   await queryInterface.addColumn("Users", "uuid", {
    //     type: Sequelize.UUID,
    //     defaultValue: Sequelize.UUID,
    //     allowNull: true,
    //     unique: true,
    //   });
    // } else {
    //   console.log("Column 'uuid' already exists in 'Users' table.");
    // }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
