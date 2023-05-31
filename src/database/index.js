const Sequelize = require("sequelize");

const User = require("../app/models/user");
const Conta = require("../app/models/conta");
const Movimentacao = require("../app/models/movimentacao");

const databaseConfig = require("../config/database");

const models = [User, Conta, Movimentacao];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
