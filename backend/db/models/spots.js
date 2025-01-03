'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

let schema;
if (process.env.NODE_ENV === 'production') {
  schema = process.env.SCHEMA;
}

module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Spots.hasMany(models.Review, { foreignKey: 'spotId', onDelete: "CASCADE", hooks: true })
      Spots.hasMany(models.Bookings, { foreignKey: 'spotId', onDelete: "CASCADE", hooks: true })
      Spots.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: "CASCADE", hooks: true })
      Spots.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId' })
    }
  }
  Spots.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.DECIMAL,
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
    modelName: 'Spots',

    scopes: {
      getAllSpots() {
        return {
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [
              Sequelize.literal(
                `(SELECT ROUND(AVG(stars), 1) FROM ${schema ? `"${schema}"."Reviews"` : 'Reviews'
                } WHERE "Reviews"."spotId" = "Spot"."id")`
              ),
              'avgRating',
            ],
            [
              Sequelize.literal(
                `(SELECT url FROM ${schema ? `"${schema}"."SpotImages"` : 'SpotImages'
                } WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
              ),
              'previewImage',
            ],
          ],
        };
      },
    }
  
  });
  return Spots;
};