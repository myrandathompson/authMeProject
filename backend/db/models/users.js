'use strict';

let options = {};
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Associations for the User model
     */
    static associate(models) {
      // Example association:
      // User.hasMany(models.Post, { foreignKey: 'userId' });
    }

    /**
     * Instance method to validate a password
     */
    async validatePassword(password) {
      return bcrypt.compare(password, this.hashedPassword);
    }

    /**
     * Static method to find a user by email or username
     */
    static async findByLogin(login) {
      return await User.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: [
            { email: login },
            { username: login },
          ],
        },
      });
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30],
        },
      },
    //   ownerId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //     validate: {
    //       isNumeric: true,
    //     },
    //   },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Username cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',

      // Scopes for common queries
      defaultScope: {
        attributes: { exclude: ['hashedPassword'] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  /**
   * Hook to hash password before saving
   */
  User.beforeCreate(async (user) => {
    if (user.hashedPassword) {
      user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('hashedPassword')) {
      user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
    }
  }, options);

  return User;
};
