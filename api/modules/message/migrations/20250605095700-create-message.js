'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      lead_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leads', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sender_phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiver_phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message_type: {
        type: Sequelize.ENUM('incoming', 'outgoing'),
        allowNull: false,
        defaultValue: 'incoming',
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      status: {
        type: Sequelize.ENUM('sent', 'delivered', 'read', 'failed'),
        allowNull: false,
        defaultValue: 'sent',
      },
      quality_label: {        // <--- include here!
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
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  }
};
