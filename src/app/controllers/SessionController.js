const Yup = require("yup");
const SessionService = require("../services/SessionService");

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na Validação dos Dados." });
    }

    const user = await SessionService.findByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({ error: "Usuário Inexistente." });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return res.status(401).json({ error: "Senha Inválida." });
    }

    const sessionService = await SessionService.store(req.body);

    return res.json(sessionService);
  }
}

module.exports = new SessionController();
