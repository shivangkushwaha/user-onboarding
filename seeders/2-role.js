"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Generating System Permissions 
    return queryInterface.bulkInsert("roles", [{
      name:"Admin",
      is_basic:1,
      code:"admin",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name:"User",
      is_basic:1,
      code:"user",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
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
