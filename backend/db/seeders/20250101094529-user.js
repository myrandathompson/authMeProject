'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await User.bulkCreate ([
        {
          id: 1,
          email: 'demo@user.io',
          firstName: 'FakeName',
          lastName: 'FakeLast',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user1@user.io',
          firstName: 'FakeNamea',
          lastName: 'FakeLasta',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          email: 'user2@user.io',
          firstName: 'FakeNameb',
          lastName: 'FakeLastb',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], { validate: true });
    } catch (error) {
      console.error('Validation error:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'User';
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
    });
  },
};
