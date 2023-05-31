const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class Movimentacao extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING,
        valor: Sequelize.DECIMAL(10, 2),
        conta_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: "movimentacoes",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Conta, { foreignKey: "conta_id", as: "conta" });
  }
}

module.exports = Movimentacao;
