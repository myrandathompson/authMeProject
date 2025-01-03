'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // ReviewImage.belongsTo(models.Reviews, { foreignKey: 'reviewId' })
    }
  }
  ReviewImage.init({
    url: {
      type: DataTypes.STRING,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};