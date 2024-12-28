'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Users } = require('../models');
const bcrypt = require('bcryptjs'); // To hash passwords

const Users = [
  {
    firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'JohnD',
        hashedPassword: await bcrypt.hash('password123', 10), // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
  },
  {
    firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        username: 'JaneS',
        hashedPassword: await bcrypt.hash('password456', 10), // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
  },
  {
    firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        username: 'AliceJ',
        hashedPassword: await bcrypt.hash('password789', 10), // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
  },
  {
    firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
        username: 'JohnSmith',
        hashedPassword: await bcrypt.hash('password789', 10), // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let user of Users) {
      const { id, firstName, lastName, email, username} = user;
      await Users.create({ id, firstName, lastName, email, username});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};