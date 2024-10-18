const express = require("express");
const server = express();
const usuario = require("./scr/teste.json");
const evento = require("./scr/teste1.json");
const { dirname } = require("path");

server.get("/usuario", (req, res) =>{
    return res.json({usuario})
});
server.get("/eventos", (req, res) =>{
    return res.json({evento}) 
});

server.get("/", function (req, res){
    return res.send("cu") 
});

server.get("/teste", function (req, res) {
    res.sendFile(__dirname + "/html/Index.html");
});

server.listen(6969, ()=>{
    console.log("servidor on")
});