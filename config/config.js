const fs = require("fs");
require("dotenv").config();
require('../env/env');

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    host: process.env.HOST,
    port: +process.env.PORT,
    dialect: process.env.DIALECT,
    seederStorage:"sequelize",
    seederStorageTableName: "sequelize_data"
  }
};