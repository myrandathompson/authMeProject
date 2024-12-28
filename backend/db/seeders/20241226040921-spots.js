'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', [
      {
        id: 3,
        ownerId: 1,
        address: "54 Flower Ct",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Outdoors",
        description: "Place where web developers are created",
        price: 175,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36",
        avgRating: 4.5,
        // previewImage: "image url" // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        ownerId: 2,
        address: "111 Daisy",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Summer",
        description: "Place where web developers are created",
        price: 154,
        avgRating: 4.5,
        // previewImage: "image url" // Replace with hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 1,
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36",
        avgRating: 4.5,
        previewImage: "image url"
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
