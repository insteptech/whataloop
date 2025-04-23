"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true
      },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      fullName: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      otp: { type: Sequelize.STRING, allowNull: true },
      otpExpires: { type: Sequelize.DATE, allowNull: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_type: {
        type: Sequelize.ENUM("free", "starter", "pro"),
        defaultValue: "free",
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
