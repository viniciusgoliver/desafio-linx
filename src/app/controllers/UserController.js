const Yup = require("yup");
const UserService = require("../services/UserService");

class UserController {
  async index(req, res) {
    const users = await UserService.index();

    return res.json(users);
  }

  async show(req, res) {
    const user = await UserService.show(req.params.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na Validação dos Dados." });
    }

    const userExists = await UserService.findByEmail(req.body.email);

    if (userExists) {
      return res.status(400).json({ error: "Usuário já Existente na Base." });
    }

    const userExistsCPF = await UserService.findByCPF(req.body.cpf);

    if (userExistsCPF) {
      return res.status(400).json({ error: "CPF já Existente na Base." });
    }

    const user = await UserService.store(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na Validação dos Dados." });
    }

    const userExists = await UserService.findByID(req.params.id);

    if (!userExists) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const { password, confirmPassword } = req.body;

    if (password && !(await user.checkPassword(confirmPassword))) {
      return res.status(401).json({ error: "Senha não corresponde." });
    }

    const userUpdate = await UserService.update(req.params.id, req.body);

    if (!userUpdate) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    return res.json(userUpdate);
  }

  async delete(req, res) {
    const userExists = await UserService.findByID(req.params.id);

    if (!userExists) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    await UserService.delete(req.params.id);

    return res.json({ message: "Usuário excluído com sucesso." });
  }

  async updatePassword(req, res) {
    const schema = Yup.object().shape({
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na Validação dos Dados." });
    }

    const { oldPassword } = req.body;

    const user = await UserService.findByID(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha não corresponde." });
    }

    await UserService.updatePassword(req.userId, req.body);

    return res.json({ message: "Senha alterada com sucesso." });
  }

  async userInfo(req, res) {
    const user = await UserService.userInfo(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
}

module.exports = new UserController();
