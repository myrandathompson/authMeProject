'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in production
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        id: 1,
        userId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 2,
        address: '5458 Beautiful St',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: 38.1454756,
        lng: -157.4515847,
        name: 'A Place With Snow',
        description: 'A small condo on the slopes',
        price: 455.00,
        createdAt: new Date(),
        updatedAt: new Date()     
      },
      {
        id: 3,
        userId: 3,
        address: '6482 Bronco Dr',
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
        lat: 45.4546458,
        lng: -181.145645,
        name: 'The Shack',
        description: 'Small ugly shack.',
        price: 50.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 3,
        address: '4444 Urban Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.71,
        lng: -74.01,
        name: 'Penthouse',
        description: 'Luxurious city living with stunning skyline views.',
        price: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        userId: 2,
        address: '3333 Forest Rd',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: 45.52,
        lng: -122.68,
        name: 'Cabin',
        description: 'Nestled in the woods, this cozy cabin offers tranquility and privacy.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        userId: 3,
        address: '2222 Sunny Ave',
        city: 'San Diego',
        state: 'CA',
        country: 'USA',
        lat: 33.12,
        lng: -117.33,
        name: 'Beach House',
        description: 'Ocean views and direct beach access make this an ideal retreat.',
        price: 1200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        userId: 3,
        address: '1111 Mainly St',
        city: 'Las Vegas',
        state: 'NV',
        country: 'USA',
        lat: 77.39,
        lng: 89.15,
        name: 'House',
        description: 'High ceilings and open layouts provide a spacious and airy feel.',
        price: 789.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        userId: 1,
        address: '6666 Mountain View Dr',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: 39.74,
        lng: -104.99,
        name: 'Chalet',
        description: 'A modern chalet with breathtaking mountain views and ski access.',
        price: 2500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        userId: 1,
        address: '7777 Bayfront Ct',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.76,
        lng: -80.19,
        name: 'Condo',
        description: 'Waterfront condo with easy access to the beach and nightlife.',
        price: 950.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        userId: 1,
        address: '8888 Prairie St',
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
        lat: 32.77,
        lng: -96.79,
        name: 'Ranch House',
        description: 'Large ranch house with spacious yards and modern amenities.',
        price: 1100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        userId: 1,
        address: '3333 Forest Rd',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: 45.52,
        lng: -122.68,
        name: 'Cabin',
        description: 'Nestled in the woods, this cozy cabin offers tranquility and privacy.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        userId: 2,
        address: '4444 Urban Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.71,
        lng: -74.01,
        name: 'Penthouse',
        description: 'Luxurious city living with stunning skyline views.',
        price: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {id: 13,
        userId: 2,
        address: '5555 Desert Ln',
        city: 'Phoenix',
        state: 'AZ',
        country: 'USA',
        lat: 33.44,
        lng: -112.07,
        name: 'Villa',
        description: 'Expansive property with a pool and desert landscaping.',
        price: 1500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        userId: 2,
        address: '1313 Alpine Dr',
        city: 'Salt Lake City',
        state: 'UT',
        country: 'USA',
        lat: 40.76,
        lng: -111.89,
        name: 'Ski Lodge',
        description: 'Rustic lodge perfect for winter getaways and skiing adventures.',
        price: 1800.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {id: 15,
        userId: 2,
        address: '1414 Harbor St',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        lat: 47.60,
        lng: -122.33,
        name: 'Apartment',
        description: 'Modern apartment with views of the waterfront and city skyline.',
        price: 1200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        userId: 2,
        address: '1515 Vineyard Ln',
        city: 'Napa',
        state: 'CA',
        country: 'USA',
        lat: 38.30,
        lng: -122.29,
        name: 'Estate',
        description: 'Exclusive estate surrounded by vineyards and rolling hills.',
        price: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        userId: 2,
        address: '1616 Parkside Dr',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.77,
        lng: -122.41,
        name: 'Row House',
        description: 'Charming row house with Victorian architecture near Golden Gate Park.',
        price: 2200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        userId: 2,
        address: '1717 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.05,
        lng: -118.25,
        name: 'Mansion',
        description: 'Expansive mansion with luxurious amenities and city views.',
        price: 8000.00,
        createdAt: new Date(),
        updatedAt: new Date()
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

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]}
    }, {});

    
    }  
  };



