'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'FakeName',
        lastName: 'FakeLast',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        firstName: 'FakeNamea',
        lastName: 'FakeLasta',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        firstName: 'FakeNameb',
        lastName: 'FakeLastb',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  } catch (error) {
    console.error('Validation error:', error);
  }
 },

 async down (queryInterface, Sequelize) {
   options.tableName = 'User';
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete(options, {
     username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
   }, {});
 }
};