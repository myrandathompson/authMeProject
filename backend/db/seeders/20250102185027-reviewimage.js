'use strict';
const { Op } = require('sequelize');
const { ReviewImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImage";
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "https://www.arhomes.com/wp-content/uploads/2022/11/Dawning_OptionalPool-Dusk.webp",
        },
        {
          reviewId: 1,
          url: "https://lirp.cdn-website.com/28156074/dms3rep/multi/opt/01+-+True+Homes+-+Huntley+-+R02-3x2-1920w.jpg",

        },
        {
          reviewId: 1,
          url: "www.picture3review1.com",

        },
        {
          reviewId: 2,
          url: "www.picture1review2.com",
        },
        {
          reviewId: 2,
          url: "www.picture2review2.com",

        },
        {
          reviewId: 2,
          url: "www.picture3review2.com",

        },
        {
          reviewId: 3,
          url: "www.picture3review3.com",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImage";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      null,
      {}
    );
  },
};