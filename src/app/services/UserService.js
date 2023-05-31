const User = require("../models/user");

class UserService {
  constructor() {
    this.user = User;
  }

  async index() {
    const users = await this.user.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    return users;
  }

  async show(id) {
    const user = await this.user.findByPk(id, {
      attributes: ["id", "name", "email", "role"],
    });

    return user;
  }

  async store(data) {
    const user = await this.user.create(data);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      cpf: user.cpf,
      dt_nascimento: user.dt_nascimento,
    };
  }

  async update(id, data) {
    const user = await this.user.findByPk(id);
    const { name, role } = await user.update(data);

    return {
      id,
      name,
      role,
    };
  }

  async delete(id) {
    const user = await this.user.findByPk(id);

    await user.destroy();
  }

  async updatePassword(id, data) {
    const user = await this.user.findByPk(id);

    const userUpdated = await user.update(data);

    return userUpdated;
  }

  async userInfo(id) {
    const user = await this.user.findByPk(id);

    return user;
  }

  async findByEmail(email) {
    const userExists = await this.user.findOne({
      where: {
        email: email,
      },
    });

    return userExists;
  }

  async findByCPF(cpf) {
    const userExists = await this.user.findOne({
      where: {
        cpf: cpf,
      },
    });

    return userExists;
  }

  async findByID(id) {
    const user = await this.user.findByPk(id);

    return user;
  }
}

module.exports = new UserService();
