const Yup = require("yup");
const MovimentacaoService = require("../services/MovimentacaoService");
const {
  formatCasaDecimal,
  formatDate,
  formatDateNascimento,
  validarDeposito,
  validarSaque,
  priorizarMaiores,
  getCacheExtratoConta,
  setCacheExtratoConta,
} = require("../utils/helpers");

class MovimentacaoController {
  async deposito(req, res) {
    const schema = Yup.object().shape({
      tipo: Yup.string().required(),
      valor: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { tipo, valor } = req.body;
    const { conta_id } = req.params;

    if (!validarDeposito(valor)) {
      return res.status(400).json({
        error:
          "Valor de depósito inválido. Não é permitido depositar valores com centavos.",
      });
    }

    const conta = await MovimentacaoService.findByConta(conta_id);

    if (!conta) {
      return res.status(400).json({ error: "Conta não encontrada" });
    }

    if (
      tipo === "DEBITO" ||
      tipo === "SAQUE" ||
      tipo === "CREDITO" ||
      tipo === "PAGAMENTO"
    ) {
      if (valor > conta.saldo) {
        return res.status(400).json({ error: "Saldo insuficiente" });
      }
    }

    if (tipo === "SAQUE") {
      if (valor > conta.limite_saque_diario) {
        return res
          .status(400)
          .json({ error: "Valor maior que o limite de saque diário" });
      }
    }

    const movimentacao = await MovimentacaoService.deposito({
      tipo,
      valor,
      conta_id,
    });

    switch (tipo) {
      case "DEBITO":
      case "SAQUE":
      case "PAGAMENTO":
      case "PIX":
      case "TRANSFERENCIA":
        conta.saldo = parseFloat(conta.saldo) - parseFloat(valor);
        break;
      case "DEPOSITO":
        conta.saldo = parseFloat(conta.saldo) + parseFloat(valor);
    }

    const contaUpdate = await conta.update({
      saldo: formatCasaDecimal(conta.saldo),
    });

    const movimentacaoFormatada = {
      id: movimentacao.id,
      tipo: movimentacao.tipo,
      valor: movimentacao.valor,
      data: formatDate(movimentacao.createdAt),
      conta: {
        agencia: contaUpdate.agencia,
        conta: contaUpdate.conta,
        tipo_conta: contaUpdate.tipo_conta,
        saldo: contaUpdate.saldo,
        limite_saque_diario: contaUpdate.limite_saque_diario,
      },
    };

    return res.json(movimentacaoFormatada);
  }

  async extrato(req, res) {
    const { conta_id } = req.params;

    const cacheExtrato = await getCacheExtratoConta(conta_id);

    if (cacheExtrato === null) {
      const conta = await MovimentacaoService.findByConta(conta_id);

      if (!conta) {
        return res.status(400).json({ error: "Conta não encontrada" });
      }

      const movimentacoes = await MovimentacaoService.extrato(conta_id);

      const extrato = {
        conta: {
          agencia: movimentacoes[0].conta.agencia,
          conta: movimentacoes[0].conta.conta,
          tipo_conta: movimentacoes[0].conta.tipo_conta,
          saldo: movimentacoes[0].conta.saldo,
          limite_saque_diario: movimentacoes[0].conta.limite_saque_diario,
          extrato: movimentacoes.map((movimentacao) => {
            return {
              id: movimentacao.id,
              tipo: movimentacao.tipo,
              valor: movimentacao.valor,
              data: formatDate(movimentacao.createdAt),
            };
          }),
        },
      };

      await setCacheExtratoConta(conta_id, extrato);
      return res.json(extrato);
    }

    return res.json(cacheExtrato);
  }

  async saldo(req, res) {
    const { conta_id } = req.params;

    const conta = await MovimentacaoService.findOneByConta(conta_id);

    if (!conta) {
      return res.status(400).json({ error: "Conta não encontrada" });
    }

    const contaFormatada = {
      agencia: conta.agencia,
      conta: conta.conta,
      tipo_conta: conta.tipo_conta,
      saldo: conta.saldo,
      limite_saque_diario: conta.limite_saque_diario,
      cliente: {
        id: conta.user.id,
        name: conta.user.name,
        email: conta.user.email,
        dt_nascimento: formatDateNascimento(conta.user.dt_nascimento),
        cpf: conta.user.cpf,
      },
    };

    return res.json(contaFormatada);
  }

  async saque(req, res) {
    const schema = Yup.object().shape({
      valor: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const { valor } = req.body;
    const { conta_id } = req.params;

    if (!validarSaque(valor)) {
      return res.status(400).json({
        error:
          "Valor de saque inválido. Só é permitido valores das notas de 20, 50 ou 100.",
      });
    }

    const conta = await MovimentacaoService.findByConta(conta_id);

    if (!conta) {
      return res.status(400).json({ error: "Conta não encontrada" });
    }

    if (valor > conta.saldo) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    if (valor > conta.limite_saque_diario) {
      return res
        .status(400)
        .json({ error: "Valor maior que o limite de saque diário" });
    }

    const movimentacao = await MovimentacaoService.saque({
      tipo: "SAQUE",
      valor,
      conta_id,
    });

    conta.saldo = parseFloat(conta.saldo) - parseFloat(valor);

    const contaUpdate = await conta.update({
      saldo: formatCasaDecimal(conta.saldo),
    });

    const movimentacaoFormatada = {
      id: movimentacao.id,
      tipo: movimentacao.tipo,
      valor: movimentacao.valor,
      data: formatDate(movimentacao.createdAt),
      conta: {
        agencia: contaUpdate.agencia,
        conta: contaUpdate.conta,
        tipo_conta: contaUpdate.tipo_conta,
        saldo: contaUpdate.saldo,
        limite_saque_diario: contaUpdate.limite_saque_diario,
      },
      valor_liberado: priorizarMaiores(valor).valor_saque,
      cedulas: priorizarMaiores(valor).notasRetiradas,
    };

    return res.json(movimentacaoFormatada);
  }
}

module.exports = new MovimentacaoController();
