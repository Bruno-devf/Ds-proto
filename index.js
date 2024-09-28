const express = require("express")
const server = express()
const usuario = require("./scr/teste.json")
const eventos = require("./scr/teste1.json")

server.get("/usuario", (req, res) =>{
    return res.json({usuario})
})
server.get("/evento", (req, res) =>{
    return res.json({eventos}) 
})


server.listen(3300, ()=>{
    console.log("servidor on")
})
