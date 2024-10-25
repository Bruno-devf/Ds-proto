const { Sequelize, DataTypes } = require("sequelize");
 
const sequelize = new Sequelize("tasks", "root", "", {
    host: "localhost",
    dialect: "mysql",
});
 
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
 
Professor.hasMany(Evento, { foreignKey: 'responsavelId' });
Evento.belongsTo(Professor, { foreignKey: 'responsavelId' });
Evento.hasMany(Relatorio, { foreignKey: 'eventoId' });
Relatorio.belongsTo(Evento, { foreignKey: 'eventoId' });
Professor.hasMany(Relatorio, { foreignKey: 'professorId' });
Relatorio.belongsTo(Professor, { foreignKey: 'professorId' });
 
const syncModels = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
};
 
syncModels();
 
 
const insert = async () => {
    try {
        const professor1 = await Professor.create({
            nome: "Carlos Silva",
            email: "carlos.silva@example.com",
            senha: "senhaSegura123"
        });
 
        const evento1 = await Evento.create({
            nome: "Workshop de Programação",
            data: new Date("2024-11-10"),
            descricao: "Um workshop sobre as melhores práticas em programação.",
            local: "Auditório Principal",
            responsavelId: professor1.id,
            horario: "10:00:00"
        });
 
        await Relatorio.create({
            descricao: "Relatório do Workshop de Programação.",
            tipo: "Feedback",
            eventoId: evento1.id,
            professorId: professor1.id
        });
 
        const professor2 = await Professor.create({
            nome: "Maria Oliveira",
            email: "maria.oliveira@example.com",
            senha: "senhaSuperSegura456"
        });
 
        const evento2 = await Evento.create({
            nome: "Seminário de Inteligência Artificial",
            data: new Date("2024-12-15"),
            descricao: "Discussão sobre as últimas tendências em IA.",
            local: "Sala 101",
            responsavelId: professor2.id,
            horario: "14:00:00"
        });
 
        await Relatorio.create({
            descricao: "Relatório do Seminário de Inteligência Artificial.",
            tipo: "Resumo",
            eventoId: evento2.id,
            professorId: professor2.id
        });
 
        console.log("Todos os dados inseridos com sucesso!");
    } catch (err) {
        console.error("Erro ao inserir dados:", err);
    }
};
 
insert();