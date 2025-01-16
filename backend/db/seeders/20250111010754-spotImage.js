'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in production
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        url: 'https://photos.zillowstatic.com/fp/2c985a3dabbb57a7436d6e2fe3f8240a-p_e.jpg',
        spotId: 1,
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/4/20/0/HUHH2022_Amazing%20Kitchens_Greenwich-CT-Estate-06.jpg.rend.hgtvcom.966.644.suffix/1650498253351.jpeg',
        spotId: 1,
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://st.hzcdn.com/simgs/pictures/bedrooms/loft-bedroom-bathroom-suite-pangaea-interior-design-portland-or-img~1dc17eca0e1dbe81_4-2408-1-f96d5b9.jpg',
        spotId: 1,
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://i.pinimg.com/736x/30/6d/7a/306d7af0ea3250d6390a773ffba68a4a--ensuite-bathrooms-open-plan-bathrooms.jpg',
        spotId: 1,
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://d3exkutavo4sli.cloudfront.net/wp-content/uploads/2014/08/bathroom-in-bedroom-2-1024x661.jpg',
        spotId: 1,
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://ca-times.brightspotcdn.com/dims4/default/eaf51d6/2147483647/strip/true/crop/4200x2519+0+0/resize/1200x720!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F0e%2F2d%2F03612a3b4690b9ba8f84693b43be%2Fimage-1.jpg',
        spotId: 2,
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://www.zingyhomes.com/projectImages/2017/01/16/Clipboard01.jpg',
        spotId: 2,
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: 'https://cdn.trendir.com/wp-content/uploads/2016/12/Dupli-Dos-by-Juma-Architects-900x592.jpg',
        spotId: 2,
        preview: false,
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
    options.tableName = 'SpotImages'; // Define table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }, // Filter by `spotId` dynamically
      }, {});
  }
};
