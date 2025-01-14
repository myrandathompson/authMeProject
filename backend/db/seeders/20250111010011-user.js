"use strict";

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Users";

        await queryInterface.bulkInsert(
            options,
            [
              {
                id: 1,
                firstName: 'FakeName',
                lastName: 'FakeLast',
                username: 'Demo-lition',
                email: 'demo@user.io',
                hashedPassword: bcrypt.hashSync('password'),
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: 2,
                firstName: 'FakeNamea',
                lastName: 'FakeLasta',
                username: 'FakeUser1',
                email: 'user1@user.io',
                hashedPassword: bcrypt.hashSync('password2'),
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: 3,
                firstName: 'FakeNameb',
                lastName: 'FakeLastb',
                username: 'FakeUser2',
                email: 'user2@user.io',
                hashedPassword: bcrypt.hashSync('password3'),
                createdAt: new Date(),
                updatedAt: new Date(),
              },
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
