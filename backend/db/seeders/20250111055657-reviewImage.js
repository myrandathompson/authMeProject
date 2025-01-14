'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://www.arhomes.com/wp-content/uploads/2022/11/Dawning_OptionalPool-Dusk.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 1,
        url: "https://lirp.cdn-website.com/28156074/dms3rep/multi/opt/01+-+True+Homes+-+Huntley+-+R02-3x2-1920w.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 1,
        url: "http://www.picture3review1.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: "http://www.picture1review2.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: "http://www.picture2review2.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: "http://www.picture3review2.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 3,
        url: "http://www.picture3review3.com",
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
    options.tableName = 'ReviewImages'; // Set the table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: { [Op.in]: [1, 2, 3] }, // Filter by `reviewId` for a more dynamic approach
      },
      
    );
  }
};
