const { Sequelize } = require("sequelize");
const connect = new Sequelize("events", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

connect
    .authenticate()
    .then(function () {
        console.log("Conexão Bem Sucedida!!!");
    })
    .catch(function (err) {
        console.log("Erro ao conectar ao banco de dados: " + err);
    });

