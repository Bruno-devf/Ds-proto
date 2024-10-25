const express = require("express");
const server = express();
const { create } = require("express-handlebars");
const Sequelize = require("sequelize");

// Uncomment and specify the dialect if you want to connect to a database
// const conexaoComBanco = new Sequelize("teste", "root", "", {
//   host: "localhost",
//   dialect: "mysql", // Specify your dialect here
// });

server.get("/professor/:nome/:email/:senha", function (req, res) {
    res.send(req.params);
});

server.get("/relatorio/:data/:desc/:finalidade", function (req, res) {
    res.send(req.params);
});

server.get("/evento/:nome/:data/:desc/:horario", function (req, res) {
    res.send(req.params);
});

//server.get("/cad", function (req, res) {
    // Render the form template
    //res.render("form");
//});

// Set up Handlebars
//const abs = create({ defaultLayout: "main" });
//server.engine("handlebars", abs.engine);  
//server.set("view engine", "handlebars");

server.listen(3300, () => {
    console.log("Servidor online");
});
