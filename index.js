const express = require("express")
const server = express()
const carros = require("./scr/teste.json")

server.get("/teste", (req, res) =>{
    return res.json({mensagem: "hello worldaaaaa"})
})
server.get("/teste1", (req, res) =>{
    return res.json({mensagem: "Olá mundo"})
})
server.get("/teste2", (req, res) =>{
    return res.json({mensagem: "Olá"})
})


server.listen(3300, ()=>{
    console.log("servidor on")
})
