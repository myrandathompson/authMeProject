'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const { Op } = require('sequelize'); // Add Op for OR queries

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
      User.hasMany(models.Booking, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }

    /**
     * Login method for user authentication.
     */
    static async login({ credential, password }) {
      const user = await User.findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          }
        },
        attributes: { include: ['hashedPassword'] } // Include hashedPassword in the query
      });
    
      if (user && bcrypt.compareSync(password, user.hashedPassword.toString())) {
        return user;
      }
      return null;
    }
    
    /**
     * Safe object representation for user instance.
     */
    toSafeObject() {
      const { id, username, email, firstName, lastName } = this; // only return safe fields
      return { id, username, email, firstName, lastName };
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
      allowNull: false,
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
      },
    },
  });
  return User;
};
