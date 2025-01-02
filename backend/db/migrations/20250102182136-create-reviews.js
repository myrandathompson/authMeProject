'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users"
        },
        allowNull: false
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Reviews",
          id: "id",
        },
        onDelete: "CASCADE"
      },
      url: {
        type: Sequelize.STRING
      },
      spotId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Spots"
        },
        allowNull: false
      },
      review: {
        type: Sequelize.STRING
      },
      stars: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews', options);
  }
};