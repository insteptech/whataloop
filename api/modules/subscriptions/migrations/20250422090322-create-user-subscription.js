'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserSubscriptions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      stripe_subscription_id: {
        type: Sequelize.STRING(100),
      },
      plan: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Subscriptions',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM("active", "canceled", "trialing"),
        defaultValue: "trialing",
      },
      started_at: {
        type: Sequelize.DATE,
      },
      ended_at: {
        type: Sequelize.DATE,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserSubscriptions');
  }
};