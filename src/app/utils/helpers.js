const redis = require("redis");

const formatMoney = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatMoneyToFloat = (value) => {
  return parseFloat(value.replace("R$", "").replace(",", "."));
};

const formatDecimal = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
  }).format(value);
};

const formatDecimalToFloat = (value) => {
  return parseFloat(value.replace(",", "."));
};

const formatCasaDecimal = (value) => {
  return parseFloat(value).toFixed(2);
};

const formatDate = (value) => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
};

const formatDateNascimento = (value) => {
  const formatString = String(value);
  const data = formatString.split("-");
  return `${data[2]}/${data[1]}/${data[0]}`;
};

const generateAgencia = () => {
  return Math.floor(Math.random() * 9999) + 1;
};

const generateConta = () => {
  return Math.floor(Math.random() * 999999) + 1;
};

const tipoConta = (value) => {
  switch (value) {
    case "CC":
      return "Conta Corrente";
    case "CP":
      return "Conta Poupança";
    default:
      return "Não identificado";
  }
};

const tipoMovimentacao = (value) => {
  switch (value) {
    case "DEPOSITO":
      return "Depósito";
    case "SAQUE":
      return "Saque";
    case "TRANSFERENCIA":
      return "Transferência";
    case "PAGAMENTO":
      return "Pagamento";
    case "PIX":
      return "Pix";
    case "DEBITO":
      return "Débito";
    default:
      return "Não identificado";
  }
};

const validarDeposito = (valor) => {
  if (typeof valor !== "number") {
    return false;
  }

  return Math.floor(valor) === valor;
};

const validarSaque = (valor) => {
  if (!Number.isInteger(valor)) {
    return false;
  }

  return valor % 20 === 0 || valor % 50 === 0 || valor % 100 === 0;
};

const priorizarMaiores = (valor) => {
  const notasDisponiveis = [100, 50, 20];
  const notasRetiradas = [];

  for (const nota of notasDisponiveis) {
    while (valor >= nota && notasDisponiveis.includes(nota)) {
      notasRetiradas.push(nota);
      valor -= nota;
    }
  }

  const somaNotasRetiradas = notasRetiradas.reduce((a, b) => a + b, 0);

  return { notasRetiradas, valor_saque: somaNotasRetiradas };
};

const setCacheExtratoConta = async (conta_id, extrato) => {
  const client = redis.createClient({
    url: "redis://desafio-linx-redis:6379",
  });

  await client.connect();
  await client.set(conta_id, JSON.stringify(extrato));
  await client.expire(conta_id, 60);
};

const getCacheExtratoConta = async (conta_id) => {
  const client = redis.createClient({
    url: "redis://desafio-linx-redis:6379",
  });

  await client.connect();
  const result = await client.get(conta_id);
  return JSON.parse(result);
};

module.exports = {
  formatMoney,
  formatMoneyToFloat,
  formatDecimal,
  formatDecimalToFloat,
  formatCasaDecimal,
  formatDate,
  formatDateNascimento,
  generateAgencia,
  generateConta,
  tipoConta,
  tipoMovimentacao,
  validarDeposito,
  validarSaque,
  priorizarMaiores,
  setCacheExtratoConta,
  getCacheExtratoConta,
};
