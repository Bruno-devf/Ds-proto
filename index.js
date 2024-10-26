const express = require("express");
const server = express();
const { create } = require("express-handlebars");
const Sequelize = require("sequelize");

const conexaoComBanco = new Sequelize("events", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

server.get("/professor/:nome/:email/:senha", function (req, res) {
    res.send(req.params);
});

server.get("/relatorio/:data/:desc/:finalidade", function (req, res) {
    res.send(req.params);
});

server.get("/evento/:nome/:data/:desc/:horario", function (req, res) {
    res.send(req.params);
});


server.get("/cad", function (req, res) {
    res.render("form");
});


const abs = create({ defaultLayout: "main" });
server.engine("handlebars", abs.engine);
server.set("view engine", "handlebars");

server.listen(3300, () => {
    console.log("Servidor online na porta 3300");
});
