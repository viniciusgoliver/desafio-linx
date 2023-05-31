const { Router } = require("express");

const UserController = require("./app/controllers/UserController");
const ContaController = require("./app/controllers/ContaController");
const MovimentacaoController = require("./app/controllers/MovimentacaoController");
const SessionController = require("./app/controllers/SessionController");

const authMiddleware = require("./app/middlewares/auth");

const routes = new Router();

routes.post("/users", UserController.store);
routes.post("/auth", SessionController.store);

routes.use(authMiddleware);

// ROUTE USERS
routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.delete);
routes.put("/reset-password", UserController.updatePassword);
routes.get("/user-info", UserController.userInfo);

// ROUTE CONTAS
routes.get("/contas", ContaController.index);
routes.post("/contas", ContaController.store);
routes.get("/minha-conta", ContaController.show);

// ROUTE MOVIMENTACOES
routes.post("/deposito/:conta_id", MovimentacaoController.deposito);
routes.get("/extrato/:conta_id", MovimentacaoController.extrato);
routes.get("/saldo/:conta_id", MovimentacaoController.saldo);
routes.post("/saque/:conta_id", MovimentacaoController.saque);

module.exports = routes;
