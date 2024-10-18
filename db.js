const { Sequelize } = require("sequelize");
const connect = new Sequelize("events", "root", "", {
    host: "localhost",
    dialect: "mysql"
});
 
const teste = connect.define("teste", {
    nome: {
        type:Sequelize.STRING,
    },
    sobrenome: {
        type: Sequelize.TEXT,
    },
});

teste.create({
    nome: "kauê",
    sobrenome: "Mendes"
});