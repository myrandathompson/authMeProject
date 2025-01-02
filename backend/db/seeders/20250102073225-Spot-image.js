'use strict';


/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        url: 'https://nh.rdcpix.com/f092286f12784800ef5932fd33dd3b61c-f1298537292rd-w960_h720.webp',
        spotId: 1,
        preview: false,
      },
      {
        url: 'https://nh.rdcpix.com/9a1db73d510adc96804162660a69a5cdc-f1689530756rd-w960_h720.webp',
        spotId: 2,
        preview: true,
      },
      {
        url: 'https://nh.rdcpix.com/f85e53e30efcb03d1bea1f47076c893cc-f2918730850rd-w960_h720.webp',
        spotId: 3,
        preview: false,
      },
      {
        url: 'https://nh.rdcpix.com/985db035bb39d47db1bacee4ff5936cec-f285083852rd-w960_h720.webp',
        spotId: 4,
        preview: false,
      },
      {
        url: 'https://nh.rdcpix.com/c976b5858ab97c65de99b50457edf2c2c-f1116775155rd-w960_h720.webp',
        spotId: 5,
        preview: false,
      },
      {
        url: 'https://lennar-media.s3.amazonaws.com/1aYayK5fHs0DbpLzoJuSnaJ7_X7_zQarw.jpg',
        spotId: 6,
        preview: false,
      },
      {
        url: 'https://nh.rdcpix.com/c5ceaee476a4d2fd8e72714a499f3aa3c-f491168443rd-w960_h720.webp',
        spotId: 7,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/974fe3ac61d5ff46a0edf2751d12e42bl-m3302482540rd-w1280_h960.webp',
        spotId: 8,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/8da615546ce87aeaa1fcb9edcbb4b556l-m222655777rd-w1280_h960.webp',
        spotId: 9,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/3947d8cd77d25c54cf99385d24846085l-m647117834rd-w1280_h960.webp',
        spotId: 10,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/f59120ae7eb39105a940348451b7e02cl-m1374649700rd-w1280_h960.webp',
        spotId: 11,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/c74451856eb0ed7352a8209cbdfbdfdel-m1389426881rd-w1280_h960.webp',
        spotId: 12,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/4717c0bc108dfb4a6e0b67ddee892ae3l-m956606828rd-w1280_h960.webp',
        spotId: 13,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/3947d8cd77d25c54cf99385d24846085l-m647117834rd-w1280_h960.webp',
        spotId: 14,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/4fca3c234efc12bbb5d1e43a3dffd3b3l-m1918420044rd-w1280_h960.webp',
        spotId: 15,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/2e5d1c5a39827e1df2dceee0894ae600l-m60790147rd-w960_h720.webp',
        spotId: 16,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/e828cb58f5bf7fe59fbf60330105b36al-m922119881rd-w960_h720.webp',
        spotId: 17,
        preview: true,
      },
      {
        url: 'https://ap.rdcpix.com/c461dd327a409f670432ea9dfc4e7b77l-m502612092rd-w2048_h1536.webp',
        spotId: 18,
        preview: true,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options, 
      {
        preview: {
          [Op.in]: [true, false],
        }
      }, {}
    );
  },
};