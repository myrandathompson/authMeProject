'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in production
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
        spotId: 1,
        userId: 3,
        review: "Close to Disneyland!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        spotId: 2,
        userId: 3,
        review: "Gross",
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        spotId: 1,
        userId: 2,
        review: "Loved it",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        spotId: 2,
        userId: 1,
        review: "Disgusting",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'; // Specify the table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        review: { [Op.in]: ["Close to Disneyland!", "Gross", "Loved it", "Disgusting"] },
      },{});
  }
};
