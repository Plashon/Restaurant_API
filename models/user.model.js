const sequelize = require("./db");
const { DataType, DataTypes } = require("sequelize");

const User = sequelize.define("users", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
