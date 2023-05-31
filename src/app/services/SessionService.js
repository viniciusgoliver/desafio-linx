const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authConfig = require("../../config/auth");

class SessionService {
  constructor() {
    this.user = User;
  }

  async store(data) {
    console.log(data);
    const userExists = await this.user.findOne({
      where: {
        email: data.email,
      },
    });

    const { email, name, id } = userExists;

    return {
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }

  async findByEmail(email) {
    const userExists = await this.user.findOne({
      where: {
        email: email,
      },
    });

    return userExists;
  }
}

module.exports = new SessionService();
