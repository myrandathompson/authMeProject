'use strict';
const {
  Model
} = require('sequelize');
const { DataTypes } = require('sequelize');
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: 'userId',
        onDelete: "CASCADE",
      });
      // User.hasMany(models.Review, {
      //   foreignKey: 'userId',
      //   onDelete: "CASCADE",
      // });
      // User.hasMany(models.Booking, {
      //   foreignKey: 'userId',
      //   onDelete: "CASCADE",
      // });
      User.hasMany(models.Booking, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,  
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },     
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
          exclude: [
              "hashedPassword",
              "email",
              "createdAt",
              "updatedAt",
          ],

}
}
  });
  return User;
};