const Movimentacao = require("../models/movimentacao");
const Conta = require("../models/conta");
const User = require("../models/user");

class MovimentacaoService {
  constructor() {
    this.movimentacao = Movimentacao;
    this.conta = Conta;
    this.user = User;
  }

  async deposito(dados) {
    const movimentacao = await this.movimentacao.create(dados);

    return movimentacao;
  }

  async findByConta(conta_id) {
    const contaByID = await this.conta.findByPk(conta_id);

    return contaByID;
  }

  async findOneByConta(conta_id) {
    const contaOneBy = await this.conta.findOne({
      where: { id: conta_id },
      attributes: [
        "agencia",
        "conta",
        "tipo_conta",
        "saldo",
        "limite_saque_diario",
      ],
      include: [
        {
          model: this.user,
          as: "user",
          attributes: ["id", "name", "email", "cpf", "dt_nascimento"],
        },
      ],
    });

    return contaOneBy;
  }

  async extrato(conta_id) {
    const movimentacoes = await this.movimentacao.findAll({
      where: { conta_id },
      attributes: ["id", "tipo", "valor", "createdAt"],
      include: [
        {
          model: this.conta,
          as: "conta",
          attributes: [
            "agencia",
            "conta",
            "tipo_conta",
            "saldo",
            "limite_saque_diario",
          ],
          include: [
            {
              model: this.user,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    return movimentacoes;
  }

  async saque(dados) {
    const movimentacao = await Movimentacao.create(dados);

    return movimentacao;
  }
}

module.exports = new MovimentacaoService();
