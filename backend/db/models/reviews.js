'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reviews.belongsTo(models.User, { foreignKey: 'userId' })
      Reviews.belongsTo(models.Spots, { foreignKey: 'spotId' })
      Reviews.hasMany(models.ReviewImage, { foreignKey: 'reviewId' })
    }
  }
  Reviews.init({
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false
    },
    reviewId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
    },
    url: {
      type: DataTypes.STRING
    },
    spotId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
    },
    stars: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};