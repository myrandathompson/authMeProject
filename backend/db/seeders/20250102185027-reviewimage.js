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
    try {
      await ReviewImage.bulkCreate(
      [
        {
          id: 1,
          reviewId: 1,
          url: "https://www.arhomes.com/wp-content/uploads/2022/11/Dawning_OptionalPool-Dusk.webp",
        },
        {
          id: 2,
          reviewId: 1,
          url: "https://lirp.cdn-website.com/28156074/dms3rep/multi/opt/01+-+True+Homes+-+Huntley+-+R02-3x2-1920w.jpg",

        },
        {
          id: 3,
          reviewId: 1,
          url: "www.picture3review1.com",

        },
        {
          id: 4,
          reviewId: 2,
          url: "www.picture1review2.com",
        },
        {
          id: 5,
          reviewId: 2,
          url: "www.picture2review2.com",

        },
        {
          id: 6,
          reviewId: 2,
          url: "www.picture3review2.com",

        },
        {
          id: 7,
          reviewId: 3,
          url: "www.picture3review3.com",
        },
    
      ],{validate: true} );
      } catch (error) {
        console.error('Validation error:', error);
      }
    },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImage";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,{
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]}
    }, {});

    
    }  
  };