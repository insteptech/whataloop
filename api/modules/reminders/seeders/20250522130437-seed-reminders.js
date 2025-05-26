'use strict';
const connectDatabase = require('../../../config/dbConnection.js'); 

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await connectDatabase.query('SELECT id FROM users LIMIT 1;');
    const leads = await connectDatabase.query('SELECT id FROM leads LIMIT 1;');

    const userId = users[0][0]?.id;
    const leadId = leads[0][0]?.id;

    if (!userId || !leadId) {
      console.warn('⚠️ No user or lead found. Please seed users and leads first.');
      return;
    }

    await queryInterface.bulkInsert('reminders', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        user_id: userId,
        lead_id: leadId,
        message: 'Follow up on proposal',
        due_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        status: 'pending',
        sent_notification: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        user_id: userId,
        lead_id: leadId,
        message: 'Call to check-in after demo',
        due_at: new Date(Date.now() + 86400 * 1000), // 1 day from now
        status: 'pending',
        sent_notification: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reminders', null, {});
  }
};
