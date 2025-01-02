'use strict';
const {
  Model
} = require('sequelize');

let schema;
if (process.env.NODE_ENV === 'production') {
  schema = process.env.SCHEMA;
}
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(models.User, { foreignKey: 'userId' })
      Bookings.belongsTo(models.Spots, { foreignKey: "spotId" })
    }
  }
  Bookings.init({
    spotId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Bookings',
  });
  return Bookings;
};