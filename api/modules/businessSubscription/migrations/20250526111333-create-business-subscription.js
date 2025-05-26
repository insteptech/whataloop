'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('BusinessSubscriptions', {
      subscription_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Businesses', // ✅ references the Businesses table
          key: 'id',           // ✅ assuming primary key in Businesses is 'id'
        },
        onDelete: 'CASCADE',
      },
      plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'SubscriptionPlans', // ✅ correct table name
          key: 'id',                  // ✅ 'id' is the PK in SubscriptionPlans
        },
        onDelete: 'CASCADE',
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('BusinessSubscriptions');
  },
};
