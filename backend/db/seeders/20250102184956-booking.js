'use strict';
const { Op } = require('sequelize');
const { Booking } = require('../models');
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2025-10-19"), //new Date ()
          endDate: new Date("2025-10-21"),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2025-12-19"),
          endDate: new Date("2025-12-21"),
        },
        {
          spotId: 1,
          userId: 2,
          startDate: new Date("2025-05-19"),
          endDate: new Date("2025-05-21"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2025-08-19"),
          endDate: new Date("2025-08-21"),
        },

        {
          spotId: 1,
          userId: 4,
          startDate: new Date("2025-04-19"),
          endDate: new Date("2025-04-21"),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2025-04-13"),
          endDate: new Date("2025-04-23"),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2025-07-19"),
          endDate: new Date("2025-07-21"),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2025-07-19"),
          endDate: new Date("2025-07-21"),
        },
        {
          spotId: 4,
          userId: 1,
          startDate: new Date("2025-01-19"),
          endDate: new Date("2025-02-04"),
        },
        {
          spotId: 6,
          userId: 1,
          startDate: new Date("2025-11-19"),
          endDate: new Date("2025-12-04"),
        },
        {
          spotId: 7,
          userId: 1,
          startDate: new Date("2025-03-24"),
          endDate: new Date("2025-03-27"),
        },
        {
          spotId: 6,
          userId: 1,
          startDate: new Date("2025-10-24"),
          endDate: new Date("2025-10-27"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2025-04-17"),
          endDate: new Date("2025-04-27"),
        },
    
      ],{validate: true} );
      } catch (error) {
        console.error('Validation error:', error);
      }
    },

  async down(queryInterface, Sequelize)  {
    options.tableName = 'Booking';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]}
    }, {});

    
    }  
  };