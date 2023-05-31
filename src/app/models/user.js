const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        dt_nascimento: Sequelize.DATEONLY,
        cpf: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        role: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: "users",
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Conta, { foreignKey: "user_id", as: "contas" });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
