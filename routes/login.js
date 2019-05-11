const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SEED =require('../config/config').SEED
let app = express();

let Usuario  =  require('../models/usuario')


//Google
const CLIENT_ID =require('../config/config').CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const verify= async ( token ) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
 
    return {
        nombre : payload.name,
        email : payload.email,
        img : payload.picture,
        google: true
        
    }
  }

  let buscarUsuarioEmail = async (email) =>{
    return await Usuario.findOne({email: email})
            .exec()
            .then(usuario => usuario)
            .catch(err =>{throw new Error(err)})
 }

 let guardarUsuario = (googleUser, res)=>{
     let usuario = new Usuario()
     usuario.nombre = googleUser.nombre
     usuario.email = googleUser.email
     usuario.img = googleUser.img
     usuario.google = true
     usuario.password = ':)'     
     
     usuario.save((err,usuarioGuardado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'token no válido',
                errors: err
        })  
        }
        let token = jwt.sign({ usuarioGuardado },SEED,{ expiresIn: 14400 })        
            return res.status(200).json({
                ok:true,
                usuarioDB: usuarioGuardado,
                token: token
            })
     })
 }

//======================================
//autenticación google
//======================================
app.post('/google',async (req,res)=>{

    let token = req.body.token

    let googleUser = await verify(token)
                            .catch(err =>{
                                    return res.status(403).json({
                                            ok: false,
                                            mensaje:'token no válido',
                                            errors: err
                                    })               
                            })
    let usuarioDB = await buscarUsuarioEmail(googleUser.email)
                            .catch(err =>{
                                return res.status(500).json({
                                    ok: false,
                                    mensaje:'token no válido',
                                    errors: err
                                })
                            });
                        
    if(usuarioDB){
        //verifica si el usuario se logueo normal
        if(usuarioDB.google===false){
            return  res.status(400).json({
                ok: true,
                mensaje:'Debe usar autenticación normal'                
            })
        }
        else{ //si no se logueo por google
            let token = jwt.sign({ UsuarioBD },SEED,{ expiresIn: 14400 })
        
            return res.status(200).json({
                ok:true,
                UsuarioBD,
                token: token
            })
        }        
    }
    else{ // si el usuario no existe
        guardarUsuario(googleUser, res);
    }
    //   return  res.status(200).json({
    //             ok: true,
    //             mensaje:'todo esta ok',
    //             googleUser
    //         })
    
})



//======================================
//autenticación normal
//======================================
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