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
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: process.env.TEST_DB,
    host: process.env.HOST, 
    port: +process.env.PORT,
    dialect: process.env.DIALECT,
    seederStorageTableName: "sequelize_data"
  },
  production: {
    username: process.env.PROD_DB_USERNAME, 
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: "mysql",
    seederStorageTableName: "sequelize_data"
  }
};