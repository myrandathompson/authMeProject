'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  spots.init({
    ownerId: {
      type: DataTypes.INTEGER,
      unique:true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 30],
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [2, 30],
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        len: [2, 30],
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        len: [2, 30],
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validator: {
        max: 90,
        min: -90,
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validator: {
        max: 90,
        min: -90,
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        len: [2, 50],
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        notEmpty: true,
        }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validator: {
        isDecimal: true,
        min: 1,
        isNumeric: true,
        }
      },
    avgRating: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validator: {
        min: 0,
        max: 5,
        isNumeric: true,
      },

    },
  },  
  {
    sequelize,
    modelName: 'spots',
  }
);
  return spots;
};