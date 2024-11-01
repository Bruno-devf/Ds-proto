const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

//### Configuração do Express e do Banco de Dados ###
const rotas = express();
rotas.use(cors());
const sequelize = new Sequelize("events", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//### Definição dos Modelos ###
const Professor = sequelize.define("professore", {
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
    await sequelize.sync({ alter: false }); // Use 'alter: false' para não fazer alterações nas tabelas existentes
    console.log("Banco de dados conectado e modelos sincronizados.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};



//### Rotas ###
rotas.get("/", function (req, res) {
  res.send("Rota principal");
});

rotas.get("/professor/:nome/:email/:senha", async function (req, res) {
  const { nome, email, senha } = req.params;
  try {
    const novoProf = await Professor.create({ nome, email, senha });
    res.json({
      resposta: "Professor criado com sucesso",
      professor: novoProf,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar professor", detalhe: error.message });
  }
});

rotas.get("/relatorio/:data/:desc/:finalidade", async function (req, res) {
  const { data, desc, finalidade } = req.params;
  try {
    const novoRelatorio = await Relatorio.create({ 
      descricao: desc, 
      tipo: finalidade, 
      data: new Date(data), // Converte a data para um objeto Date
    });
    res.json({
      resposta: "Relatório criado com sucesso",
      relatorio: novoRelatorio,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar relatório", detalhe: error.message });
  }
});

rotas.get("/evento/:nome/:data/:desc/:local/:horario", async function (req, res) {
  const { nome, data, desc, local, horario, } = req.params;
  try {
    const novoEvento = await Evento.create({ 
      nome, 
      data: new Date(data), // Converte a data para um objeto Date
      descricao: desc, 
      local,
      horario 
    });
    res.json({
      resposta: "Evento criado com sucesso",
      evento: novoEvento,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar evento", detalhe: error.message });
  }
});

rotas.get("/mostrarEvent", async function (req, res) {
    const evento = await Evento.findAll(); // Busca todos os registros
    res.json(evento); // Retorna os registros em formato JSON
});

rotas.get("/mostrarProf", async function (req, res) {
    const professor = await Professor.findAll(); // Busca todos os registros
    res.json(professor); // Retorna os registros em formato JSON
});

rotas.get("/mostrarRela", async function (req, res) {
    const relatorio = await Relatorio.findAll(); // Busca todos os registros
    res.json(relatorio); // Retorna os registros em formato JSON
});

rotas.get("/deletarEvent/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Evento.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Evento deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Evento não encontrado" });
    }
  });

  rotas.get("/deletarProf/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Professor.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Professor deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Professor não encontrado" });
    }
  });

  rotas.get("/deletarRela/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Relatorio.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Relatorio deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Relatorio não encontrado" });
    }
  });

  rotas.get("/editarProf/:id/:nome/:email/:senha", async function (req, res) {
    const { id, nome, email,senha } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const [updated] = await Professor.update(
      { nome, email, senha },
      {
        where: { id: idNumber }, // Usa o ID numérico
      }
    );
  
    res.json({
      mensagem: "Professor atualizado com sucesso",
    });
  });

  rotas.get("/editarEvent/:id/:nome/:data/:desc/:local/:horario", async function (req, res) {
    const { id, nome, data, desc, local, horario } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const [updated] = await Evento.update(
      { nome, data, desc, local, horario },
      {
        where: { id: idNumber }, // Usa o ID numérico
      }
    );
  
    res.json({
      mensagem: "Evento atualizado com sucesso",
    });
  });

  rotas.get("/editarRela/:id/:data/:desc/:finalidade", async function (req, res) {
    const { id, data, desc, finalidade } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const [updated] = await Relatorio.update(
      { data, desc, finalidade },
      {
        where: { id: idNumber }, // Usa o ID numérico
      }
    );
  
    res.json({
      mensagem: "Relatorio atualizado com sucesso",
    });
  });

//### Servidor ###
rotas.listen(3031, function () {
  console.log("Server is running on port 3031");
});
