'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('onboardings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      whatsapp_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      business_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      waba_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      waba_phone_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      raw_payload: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('onboardings');
  },
};
