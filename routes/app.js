const express = require("express");
const bodyParser = require('body-parser')

let app = express();

//rutas
app.get('/', (req,res, next)=>{
    res.status(200).json({
        ok: true,
        message:{
            message: 'Todo esta Ok'
        }
    })
 })

 module.exports = app;
 