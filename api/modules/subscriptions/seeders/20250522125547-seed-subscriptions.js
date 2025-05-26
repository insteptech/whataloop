'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = '126a986f-0f19-494b-98a6-9831109185b9'; // Replace with valid UUID from users table

    await queryInterface.bulkInsert('subscriptions', [{
      id: Sequelize.literal('gen_random_uuid()'),
      user_id: userId,
      stripe_subscription_id: 'sub_123456789',
      plan: 'starter',
      status: 'active',
      started_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subscriptions', null, {});
  }
};
