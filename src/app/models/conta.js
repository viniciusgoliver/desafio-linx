const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class Conta extends Model {
  static init(sequelize) {
    super.init(
      {
        agencia: Sequelize.STRING,
        conta: Sequelize.STRING,
        tipo_conta: Sequelize.STRING,
        saldo: Sequelize.DECIMAL(10, 2),
        limite_saque_diario: Sequelize.DECIMAL(10, 2),
        flag_ativo: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: "contas",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.Movimentacao, {
      foreignKey: "conta_id",
      as: "movimentacoes",
    });
  }
}

module.exports = Conta;
