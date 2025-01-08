'use strict';
const { Op } = require('sequelize');
const { SpotImage } = require('../models');
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize)  {
    try {
      
    await SpotImage.bulkCreate( [
      {
        id: 1,
        url: 'https://photos.zillowstatic.com/fp/2c985a3dabbb57a7436d6e2fe3f8240a-p_e.jpg',
        spotId: 1,
        preview: true,
      },
      {
        id: 2,
        url: 'https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/4/20/0/HUHH2022_Amazing%20Kitchens_Greenwich-CT-Estate-06.jpg.rend.hgtvcom.966.644.suffix/1650498253351.jpeg',
        spotId: 1,
        preview: false,
      },
      {
        id: 3,
        url: 'https://st.hzcdn.com/simgs/pictures/bedrooms/loft-bedroom-bathroom-suite-pangaea-interior-design-portland-or-img~1dc17eca0e1dbe81_4-2408-1-f96d5b9.jpg',
        spotId: 1,
        preview: false,
      },
      {
        id: 4,
        url: 'https://i.pinimg.com/736x/30/6d/7a/306d7af0ea3250d6390a773ffba68a4a--ensuite-bathrooms-open-plan-bathrooms.jpg',
        spotId: 1,
        preview: false,
      },
      {
        id: 5,
        url: 'https://d3exkutavo4sli.cloudfront.net/wp-content/uploads/2014/08/bathroom-in-bedroom-2-1024x661.jpg',
        spotId: 1,
        preview: false,
      },
      {
        id: 6,
        url: 'https://ca-times.brightspotcdn.com/dims4/default/eaf51d6/2147483647/strip/true/crop/4200x2519+0+0/resize/1200x720!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F0e%2F2d%2F03612a3b4690b9ba8f84693b43be%2Fimage-1.jpg',
        spotId: 2,
        preview: true,
      },
      {
        id: 7,
        url: 'https://www.zingyhomes.com/projectImages/2017/01/16/Clipboard01.jpg',
        spotId: 2,
        preview: false,
      },
      {
        id: 8,
        url: 'https://cdn.trendir.com/wp-content/uploads/2016/12/Dupli-Dos-by-Juma-Architects-900x592.jpg',
        spotId: 2,
        preview: false,
      },
      {
        id: 9,
        url: 'https://d3exkutavo4sli.cloudfront.net/wp-content/uploads/2014/08/bathroom-in-bedroom.jpg',
        spotId: 2,
        preview: false,
      },
      {
        id: 10,
        url: 'https://www.bestinteriordesigners.eu/wp-content/uploads/2022/11/Incredible-Open-Bathroom-Concept-for-Master-Bedroom-15.jpg',
        spotId: 2,
        preview: false,
      },
      {
        id: 11,
        url: 'https://cdn.mos.cms.futurecdn.net/8ZNVyj4UamrmxzuuHNMub7.jpg',
        spotId: 3,
        preview: true,
      },
      {
        id: 12,
        url: 'https://www.traveller.com.au/content/dam/images/h/1/4/o/e/l/image.related.articleLeadwide.620x349.h14ny5.png/1535520593139.jpg',
        spotId: 3,
        preview: false,
      },
      {
        id: 13,
        url: 'https://arc-anglerfish-arc2-prod-bostonglobe.s3.amazonaws.com/public/KX7U6MTOZYI6LKIAELFR33Z5YU.jpg',
        spotId: 3,
        preview: false,
      },
      {
        id: 14,
        url: 'https://www.digsdigs.com/photos/2018/05/02-a-boho-girlish-bedroom-with-a-free-standing-bathtub-next-to-the-bed-for-adding-a-luxurious-feel.jpg',
        spotId: 3,
        preview: false,
      },
      {
        id: 15,
        url: 'https://www.jessannkirby.com/wp-content/uploads/2020/10/Ikea-Pax-Wardrobe-Samsung-Frame-TV-Jess-Ann-Kirby-1800038.jpg',
        spotId: 3,
        preview: false,
      },
      {
        id: 16,
        url: 'https://i.ytimg.com/vi/KLwsKK8qfi0/maxresdefault.jpg',
        spotId: 4,
        preview: true,
      },
      {
        id: 17,
        url: 'https://www.contemporist.com/wp-content/uploads/2015/01/bedbath_260115_01-800x674.jpg',
        spotId: 4,
        preview: false,
      },
      {
        id: 18,
        url: 'https://cdn.trendir.com/wp-content/uploads/2016/12/Dupli-Dos-by-Juma-Architects-900x592.jpg',
        spotId: 4,
        preview: false,
      },
      {
        id: 19,
        url: 'https://www.gardendesign.com/pictures/images/500x400Exact_46x0/dream-team-s-portland-garden_6/outdoor-fire-pit-with-seating-fall-fire-pit-proven-winners_17071.jpg',
        spotId: 4,
        preview: false,
      },
      {
        id: 20,
        url: 'https://www.redfin.com/blog/wp-content/uploads/2020/05/3_Backyard-Oasis-Ideas.jpg',
        spotId: 4,
        preview: false,
      },
      {
        id: 21,
        url: 'https://www.trulia.com/pictures/thumbs_4/zillowstatic/fp/46b5211a5c69ed53ab6011057413e8c6-full.jpg',
        spotId: 5,
        preview: true,
      },    
    ],{validate: true} );
    } catch (error) {
      console.error('Validation error:', error);
    }
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImage";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]}
    }, {});

    
    }  
  };
