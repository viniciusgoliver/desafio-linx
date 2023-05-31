"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Administrador do Sistema",
          dt_nascimento: "1990-01-01",
          cpf: "12345678901",
          email: "admin@localhost.com",
          password_hash: bcrypt.hashSync("123456", 8),
          role: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
