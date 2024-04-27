const { DataTypes } = require('sequelize');
const sequelize = require('../server');

const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Customer;
