'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create leads table only
    await queryInterface.createTable('leads', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      tag: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'constants',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'constants',
          key: 'id',
        },
      },
      source: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'constants',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
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
    // Drop leads table only
    await queryInterface.dropTable('leads');
  },
};
