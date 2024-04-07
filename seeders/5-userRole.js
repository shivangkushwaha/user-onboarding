"use strict";
require("dotenv").config()

module.exports = {
  async up (queryInterface, Sequelize) {
return queryInterface.bulkInsert("user_roles", [{
  user_id:1,
  role_id:1,
  created_at: new Date(),
  updated_at: new Date()
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


