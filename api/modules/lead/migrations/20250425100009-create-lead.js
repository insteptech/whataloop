'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leads', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique:true,
        primaryKey: true,
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
      name: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(150),
      },
      tag: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Constants',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Constants',
          key: 'id',
        },
      },
      source: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Constants',
          key: 'id',
        },
      },
      notes: {
        type: Sequelize.TEXT,
      },
      last_contacted: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Leads');
  }
};