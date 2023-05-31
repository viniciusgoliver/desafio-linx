const Conta = require("../models/conta");
const User = require("../models/user");

class ContaService {
  constructor() {
    this.conta = Conta;
    this.user = User;
  }

  async index() {
    const contas = await this.conta.findAll({
      attributes: [
        "agencia",
        "conta",
        "tipo_conta",
        "saldo",
        "limite_saque_diario",
        "flag_ativo",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return contas;
  }

  async show(id) {
    const conta = await this.conta.findAll({
      where: { user_id: id },
      attributes: [
        "agencia",
        "conta",
        "tipo_conta",
        "saldo",
        "limite_saque_diario",
        "flag_ativo",
      ],
    });

    if (!conta) {
      return res.status(400).json({ error: "Conta não encontrada." });
    }

    return conta;
  }

  async store(data) {
    const bodyID = data.user_id;

    const verificaConta = await this.conta.findOne({
      where: { tipo_conta: data.tipo_conta, user_id: bodyID },
    });

    if (verificaConta) {
      return res
        .status(400)
        .json({ error: "Conta já cadastrada para este usuário." });
    }

    const conta = await this.conta.create({ ...data });

    return conta;
  }

  async findByUser(user) {
    const userExists = await this.user.findByPk(user);

    return userExists;
  }
}

module.exports = new ContaService();
