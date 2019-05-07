const express = require("express");
const bodyParser = require('body-parser')
let app = express();
const path = require('path')
const fs = require('fs')
//rutas
app.get('/:tipo/:img', (req,res, next)=>{

    
    let tipo = req.params.tipo;
    let img  = req.params.img;

    let pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${img}`) 
    if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
    }else{
        let pathNoImagen = path.resolve(__dirname,`../assets/no-img.jpg`)  
        return res.sendFile(pathNoImagen)
    }
    
 })

 module.exports = app;
 