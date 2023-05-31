"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "contas",
      [
        {
          agencia: "0001",
          conta: "0001-1",
          tipo_conta: "CC",
          saldo: 1000.0,
          limite_saque_diario: 500.0,
          flag_ativo: 1,
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
