# Desafio - Conta Extrato

Trata-se de uma aplicação para gerenciamento de conta voltada a um Banco.

Este gerenciamento contempla, operações básicas como extrato, deposito, debito, etc. Também possui módulo de Cadastro usuários, Conta, e Autenticação.

## Indíce

- [Sobre]
- [Funcionalidades]
- [Tecnologias]
- [Instalação]
  - [Instalação do Backend]

## Sobre

  A aplicação é uma modelo de simulação para gerenciamento de operações bancários e contempla funcionalidades específicas para Extrato, depósito, cadastro de conta, etc.

## Funcionalidades

- Autenticação utilizando JSON Web Token (JWT);
- Validação dos dados de entrada;
- Gestão de usuários;
- Cadastro de Contas;
- Movimentações de clientes voltadas para Conta;

## Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemailer](https://nodemailer.com)
- [Redis](https://redis.io/)
- [Yup](https://github.com/jquense/yup)
- [Docker](https://www.docker.com/)

Entre outras libs


## Instalação

Faça um clone desse repositório utilizando o comando `git clone` ou faça download.

```bash
  git clone https://github.com/viniciusgoliver/desafio-linx api-desafio
```

### Pré-requisitos

- [Docker](https://www.docker.com/)

### Backend

- A partir da raiz do projeto, entre na pasta api-desafio:

```bash
  cd api-desafio
  ```

- Execute o comando `yarn` para instalar as dependências:

```bash
    yarn
  ```

Agora vamos implementar os containers do projeto:

- container desafio-linx-api é a api de fato para o projeto
- container desafio-linx-db é o banco de dados para o projeto. É um banco postgres
- desafio-linx-pgadmin é o gerenciador web para o posgres. Este não é o obrigatório
- desafio-linx-redis é o redis para armazenamento em cache que vamos utilizar. Está rodando na porta 6380

Para executar o ambiente, rode o comando abaico
```bash
  docker-compose up -d --build
```

- Após finalizar a implementação de nossos containers. Liste o que acabamos de criar com o comando abaixo.

```bash
  docker ps
```

Vamos configurar o banco de dados da aplicação:

- Rode o comandos abaixo para executar as migrations e seeds de dados;
- Obs.: Os comandos abaixo devem ser executado após todos os containers estarem OK. Vamos executar os comando dentro do container

```bash
  docker exec desafio-linx-api yarn migrate:run
  docker exec desafio-linx-api yarn seed:all
```

Caso queria executar a api no localhost, pare o container desafio-linx-api e execute o comando abaixo.

```bash
  yarn dev
```


## APIS PARA REQUESTS


## API AUTH

Abaixo se encontra as APIS para request.

```bash

http://localhost:3000/auth
METHOD: POST
BODY:
{
   "email": "<cliente@localhost.com>",
   "password": "123456"
}

##################################################

http://localhost:3000/user-info
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API acima]

##################################################

http://localhost:3000/reset-password
METHOD: PUT
AUTHORIZATION: Bearer TOKEN: [Gerado na API acima]
BODY:
{
  "oldPassword": "123456",
  "password": "123456",
  "confirmPassword": "123456"
}

```

## API USER

Abaixo se encontra as APIS para request.

```bash

http://localhost:3000/users
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

##################################################

http://localhost:3000/users/1
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

##################################################

http://localhost:3000/users
METHOD: POST
BODY:
{
  "name": "José da Silva",
  "email": "jose.silva@localhost.com",
  "dt_nascimento": "1983-08-09",
  "cpf": "1234567e88",
  "password": "123456",
  "role": "admin"
}

##################################################

http://localhost:3000/users/1
METHOD: PUT
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]
BODY:
{
  "name": "José da Silva 2",
  "email": "jose.silva2@localhost.com",
  "role": "admin"
}

##################################################

http://localhost:3000/users/1
METHOD: DELETE
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

```

## API CONTA

Abaixo se encontra as APIS para request.

```bash

http://localhost:3000/contas
METHOD: POST
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]
BODY:
{
 "agencia": "0001",
 "conta": "0002-1",
 "tipo_conta": "CC",
 "saldo": 1000.0,
 "limite_saque_diario": 500.0,
 "flag_ativo": 1,
 "user_id": 1
}

##################################################

http://localhost:3000/contas
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

##################################################

http://localhost:3000/minha-conta
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

```

## API MOVIMENTACOES

Abaixo se encontra as APIS para request.

```bash

http://localhost:3000/extrato/1
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

Obs: Cache Aplicado nesta API
##################################################

http://localhost:3000/saldo/1
METHOD: GET
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]

##################################################

http://localhost:3000/deposito/1
METHOD: POST
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]
BODY:
{
 "tipo": "DEPOSITO",
 "valor": 20000.00
}

##################################################

http://localhost:3000/saque/1
METHOD: POST
AUTHORIZATION: Bearer TOKEN: [Gerado na API AUTH]
BODY:
{
 "tipo": "SAQUE",
 "valor": 500
}

```

Projeto by [Vinícius G. Oliveira](https://github.com/viniciusgoliver)
