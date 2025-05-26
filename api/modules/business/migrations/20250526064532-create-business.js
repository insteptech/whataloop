'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Businesses', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      website: {
        type: DataTypes.STRING,
      },
      logo_url: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('NOW()'),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Businesses');
  },
};
