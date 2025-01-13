'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'reviewId',
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: "CASCADE",
      });
    }
  }
  Spot.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Users',
        key: 'id',
      }, 
      onDelete: 'CASCADE'
      },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
    },
    lng: {
      type:DataTypes.DECIMAL,
    },  
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Spot',
    // scopes: {
    //   getAllSpots() {
    //     return {
    //       attributes: [
    //         'id',
    //         'ownerId',
    //         'address',
    //         'city',
    //         'state',
    //         'country',
    //         'lat',
    //         'lng',
    //         'name',
    //         'description',
    //         'price',
    //         'createdAt',
    //         'updatedAt',
    //         [
    //           Sequelize.literal(
    //             `(SELECT ROUND(AVG(stars), 1) FROM ${schema ? `"${schema}"."Reviews"` : 'Reviews'
    //             } WHERE "Reviews"."spotId" = "Spot"."id")`
    //           ),
    //           'avgRating',
    //         ],
    //         [
    //           Sequelize.literal(
    //             `(SELECT url FROM ${schema ? `"${schema}"."SpotImages"` : 'SpotImages'
    //             } WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
    //           ),
    //           'previewImage',
    //         ],
    //       ],
    //     };
    //   },
    // }
  });
  return Spot;
};