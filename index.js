const express = require("express");
const server = express();
const usuario = require("./scr/teste.json");
const evento = require("./scr/teste1.json");

server.get("/usuario", (req, res) =>{
    return res.json({usuario})
});
server.get("/eventos", (req, res) =>{
    return res.json({evento}) 
});

server.get("/teste/:email/:senha", (req, res) =>{
    return res.send(req.params) 
});

server.listen(6969, ()=>{
    console.log("servidor on")
});
