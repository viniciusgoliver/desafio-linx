const Yup = require("yup");
const ContaService = require("../services/ContaService");

class ContaController {
  async index(req, res) {
    const contas = await ContaService.index();

    return res.json(contas);
  }

  async show(req, res) {
    const id = req.userId;
    const conta = await ContaService.show(id);

    return res.json(conta);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      agencia: Yup.string().required(),
      conta: Yup.string().required(),
      tipo_conta: Yup.string().required(),
      saldo: Yup.number().required(),
      limite_saque_diario: Yup.number().required(),
      flag_ativo: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

    const userExists = await ContaService.findByUser(req.body.user_id);

    if (!userExists) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const conta = await ContaService.store(req.body);

    return res.json(conta);
  }
}

module.exports = new ContaController();
