'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM users LIMIT 1;`);
    const userId = users[0][0]?.id;

    if (!userId) {
      console.warn('⚠️ No user found. Please seed users first.');
      return;
    }

    await queryInterface.bulkInsert('replies', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        user_id: userId,
        title: 'Welcome Message',
        category: 'Greeting',
        content: 'Hello {{name}}, welcome to Whataloop! How can I assist you today?',
        variables: ['name'],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        user_id: userId,
        title: 'Follow-up',
        category: 'Follow-up',
        content: 'Hi {{name}}, just checking in to see if you need any more info.',
        variables: ['name'],
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('replies', null, {});
  }
};
