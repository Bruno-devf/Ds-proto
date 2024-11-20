const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");  // Biblioteca para criptografar a senha
const { Sequelize, DataTypes } = require("sequelize");

//### Configuração do Express e do Banco de Dados ###
const rotas = express();
rotas.use(express.json());
rotas.use(cors());

const sequelize = new Sequelize("evento", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//### Definição dos Modelos ###
const Professor = sequelize.define("professor", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  senha: { type: DataTypes.STRING },
});

const Evento = sequelize.define("evento", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  data: { type: DataTypes.DATE },
  descricao: { type: DataTypes.TEXT },
  local: { type: DataTypes.STRING },
  responsavelId: {
    type: DataTypes.INTEGER,
    references: { model: Professor, key: 'id' },
  },
  horario: { type: DataTypes.TIME },
});

const Relatorio = sequelize.define("relatorio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.TEXT },
  tipo: { type: DataTypes.STRING },
  eventoId: {
    type: DataTypes.INTEGER,
    references: { model: Evento, key: 'id' },
  },
  professorId: {
    type: DataTypes.INTEGER,
    references: { model: Professor, key: 'id' },
  },
});

//### Sincronização do Banco de Dados ###
const syncModels = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false }); // Não altere as tabelas existentes
    console.log("Banco de dados conectado e modelos sincronizados.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};
rotas.put("/evento/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, data, descricao, local, horario, responsavelId } = req.body;
  const idNumber = parseInt(id, 10);

  try {
    // Atualiza os dados do evento
    const evento = await Evento.update(
      { nome, data, descricao, local, horario, responsavelId },
      { where: { id: idNumber } }
    );

    if (evento[0] === 0) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
    }

    res.json({ mensagem: "Evento atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar evento", detalhe: error.message });
  }
});

//### Rota de Login ###
rotas.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o professor existe com o email fornecido
    const professor = await Professor.findOne({ where: { email } });

    if (!professor) {
      return res.status(400).json({ erro: "Email ou senha incorretos." });
    }

    // Verifica se a senha fornecida é correta (comparando a senha criptografada)
    const senhaValida = await bcrypt.compare(senha, professor.senha);

    if (!senhaValida) {
      return res.status(400).json({ erro: "Email ou senha incorretos." });
    }

    // Se as credenciais forem válidas, retorna sucesso
    res.json({
      mensagem: "Login bem-sucedido",
      professor: {
        id: professor.id,
        nome: professor.nome,
        email: professor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao realizar login", detalhe: error.message });
  }
});

//### Rota para Criar Professor (POST) ###
rotas.post("/professor", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const professorExistente = await Professor.findOne({ where: { email } });

    if (professorExistente) {
      return res.status(400).json({ mensagem: "Este email já está cadastrado." });
    }

    // Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o novo professor com a senha criptografada
    const novoProf = await Professor.create({ nome, email, senha: senhaCriptografada });

    res.json({
      mensagem: "Professor criado com sucesso",
      professor: novoProf,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar professor", detalhe: error.message });
  }
});

//### Rota para Criar Evento (POST) ###
rotas.post("/evento", async function (req, res) {
  const { nome, data, descricao, local, horario, responsavelId } = req.body;
  try {
    const novoEvento = await Evento.create({
      nome,
      data: new Date(data),  // Converte a data para um objeto Date
      descricao,
      local,
      horario,
      responsavelId
    });
    res.json({
      mensagem: "Evento criado com sucesso",
      evento: novoEvento,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar evento", detalhe: error.message });
  }
});


// Rota para Criar Relatório (POST)
rotas.post("/relatorio", async function (req, res) {
  const { descricao, tipo, eventoId, professorId } = req.body;

  // Verifica se os campos obrigatórios foram fornecidos
  if (!descricao || !tipo) {
    return res.status(400).json({ erro: "Descricao e Tipo são obrigatórios." });
  }

  try {
    // Verifica se os IDs do evento e professor são válidos, caso sejam fornecidos
    if (eventoId) {
      const evento = await Evento.findByPk(eventoId);
      if (!evento) {
        return res.status(400).json({ erro: "Evento não encontrado com o ID fornecido." });
      }
    }

    if (professorId) {
      const professor = await Professor.findByPk(professorId);
      if (!professor) {
        return res.status(400).json({ erro: "Professor não encontrado com o ID fornecido." });
      }
    }

    // Cria o novo relatório com as informações fornecidas
    const novoRelatorio = await Relatorio.create({
      descricao,
      tipo,
      eventoId,  // Pode ser null se não for fornecido
      professorId,  // Pode ser null se não for fornecido
    });

    // Retorna o relatório criado com sucesso
    res.status(201).json({
      mensagem: "Relatório criado com sucesso",
      relatorio: novoRelatorio,
    });
  } catch (error) {
    // Caso ocorra algum erro, retorna uma mensagem de erro
    res.status(500).json({ erro: "Erro ao criar relatório", detalhe: error.message });
  }
});

//### Rota para Mostrar Eventos ###
rotas.get("/mostrarEvent", async function (req, res) {
  const evento = await Evento.findAll(); // Busca todos os registros
  res.json(evento); // Retorna os registros em formato JSON
});

//### Rota para Mostrar Professores ###
rotas.get("/mostrarProf", async function (req, res) {
  const professor = await Professor.findAll(); // Busca todos os registros
  res.json(professor); // Retorna os registros em formato JSON
});

//### Rota para Mostrar Relatórios ###
rotas.get("/mostrarRelatorio", async function (req, res) {
  try {
    const relatorio = await Relatorio.findAll(); // Busca todos os registros
    res.json(relatorio); // Retorna os registros em formato JSON
  } catch (error) {
    res.status(500).json({ erro: "Erro ao carregar relatórios", detalhe: error.message });
  }
});


// Rota para Deletar Evento
rotas.delete("/deletarEvent/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Garante que o ID seja um número inteiro

  try {
    // Verifica se o evento existe e exclui
    const deleted = await Evento.destroy({
      where: { id: idNumber }
    });

    if (deleted) {
      res.json({ mensagem: "Evento deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Evento não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar evento", erro: error.message });
  }
});

// Rota para Deletar Relatório
rotas.delete("/deletarRela/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Garante que o ID seja um número inteiro

  try {
    // Verifica se o relatório existe e exclui
    const deleted = await Relatorio.destroy({
      where: { id: idNumber }
    });

    if (deleted) {
      res.json({ mensagem: "Relatório deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Relatório não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar relatório", erro: error.message });
  }
});

rotas.get("/deletarRela/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10);

  try {
      const deleted = await Relatorio.destroy({
          where: { id: idNumber },
      });

      if (deleted) {
          res.json({ mensagem: "Relatório deletado com sucesso" });
      } else {
          res.status(404).json({ mensagem: "Relatório não encontrado" });
      }
  } catch (error) {
      res.status(500).json({ mensagem: "Erro ao deletar relatório", erro: error.message });
  }
});

//### Rota para Editar Professor ###
rotas.put("/editarEvent/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, data, descricao, local, horario, responsavelId } = req.body;
  const idNumber = parseInt(id, 10);

  try {
    const evento = await Evento.update(
      { nome, data, descricao, local, horario, responsavelId },
      { where: { id: idNumber } }
    );

    if (evento[0] === 0) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
    }

    res.json({ mensagem: "Evento atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar evento", detalhe: error.message });
  }
});

// Rota de Atualização de Relatório
rotas.put("/editarRela/:id", async (req, res) => {
  const { id } = req.params;
  const { descricao, tipo } = req.body;
  const idNumber = parseInt(id, 10);

  try {
    const relatorio = await Relatorio.update(
      { descricao, tipo },
      { where: { id: idNumber } }
    );

    if (relatorio[0] === 0) {
      return res.status(404).json({ mensagem: "Relatório não encontrado" });
    }

    res.json({ mensagem: "Relatório atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar relatório", detalhe: error.message });
  }
});

// Rota de Atualização de Professor
rotas.put("/editarProf/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  const idNumber = parseInt(id, 10);

  try {
    const senhaCriptografada = senha ? await bcrypt.hash(senha, 10) : undefined;
    const professor = await Professor.update(
      { nome, email, senha: senhaCriptografada },
      { where: { id: idNumber } }
    );

    if (professor[0] === 0) {
      return res.status(404).json({ mensagem: "Professor não encontrado" });
    }

    res.json({ mensagem: "Professor atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar professor", detalhe: error.message });
  }
});
rotas.get("/evento/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  // Verifica se o ID é um número válido
  if (isNaN(idNumber)) {
    return res.status(400).json({ erro: "ID inválido fornecido" });
  }

  try {
    // Busca o evento pelo ID
    const evento = await Evento.findOne({
      where: { id: idNumber },
    });

    if (!evento) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
    }

    // Retorna os dados do evento
    res.json(evento);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar evento", detalhe: error.message });
  }
});


rotas.get("/relatorio/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  // Verifica se o ID é um número válido
  if (isNaN(idNumber)) {
    return res.status(400).json({ erro: "ID inválido fornecido" });
  }

  try {
    // Busca o evento pelo ID
    const evento = await Relatorio.findOne({
      where: { id: idNumber },
    });

    if (!evento) {
      return res.status(404).json({ mensagem: "Relatório não encontrado" });
    }

    // Retorna os dados do evento
    res.json(evento);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar relatório", detalhe: error.message });
  }
});

syncModels();

rotas.listen(3031, () => {
  console.log("API rodando na porta 3031...");
});
