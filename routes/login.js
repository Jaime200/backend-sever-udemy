const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SEED =require('../config/config').SEED
let app = express();

let Usuario  =  require('../models/usuario')


app.post('/',(req,res) =>{
    let body = req.body

   Usuario.findOne({email : body.email}, (err,UsuarioBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: `Error al buscar usuarios`,
                errors : err
            })
        }

        if(!UsuarioBD){
            return res.status(500).json({
                ok: false,
                mensaje: `Credenciales incorrectas - email` ,
                errors : err
            }) 
        }      

        
        if( !bcrypt.compareSync(body.password, UsuarioBD.password)){
            return res.status(500).json({
                ok: false,
                mensaje: `Credenciales incorrectas - password` ,
                errors : err
            })
        }

        //Crear un token!!
        UsuarioBD.password = ':)'
        let token = jwt.sign({ UsuarioBD },SEED,{ expiresIn: 14400 })
        
        return res.status(200).json({
            ok:true,
            UsuarioBD,
            token: token
        })
    })
   
})


module.exports = app