'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Op } = require('sequelize');
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Review.bulkCreate(
      [
        {
          id: 1,
          spotId: 1,
          userId: 3,
          review: "Close to Disneyland!",
          stars: 5,
        },
        {
          id: 2,
          spotId: 2,
          userId: 3,
          review: "Gross",
          stars: 2,
        },
        {
          id: 3,
          spotId: 1,
          userId: 2,
          review:
            "Loved it",
          stars: 5,
        },
        {
          id: 4,
          spotId: 2,
          userId: 1,
          review: "Disgusting",
          stars: 3,
        },
    
      ],{validate: true} );
      } catch (error) {
        console.error('Validation error:', error);
      }
    },

  async down(queryInterface, Sequelize) {
    options.tableName = "Review";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        stars: {
          [Op.in]: [1,2,3,4,5],
        },
      },
      {}
    );
  },
};