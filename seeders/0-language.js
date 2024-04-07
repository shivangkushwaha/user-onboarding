"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Generating System Permissions 
    return queryInterface.bulkInsert("languages", [{
      name: "English",
      code: "en",
      active: 1,
      created_at: new Date(),
      updated_at: new Date(),
      uuid: uuidv4()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
  }
};
