'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptionplans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      features: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      max_users: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_leads: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_messages_per_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      stripe_product_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stripe_price_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('subscriptionplans');
  },
};
