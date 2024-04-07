"use strict";
const MD5 = require("md5");
const uuid = require("uuid")
require("dotenv").config();


module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        email: process.env.ADMIN_EMAIL || "admin@ecomstore.com",
        password: MD5(process.env.ADMIN_PASSWORD || "12345678"),
        uuid: uuid.v4(),
        is_email_verify: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
  },
};
