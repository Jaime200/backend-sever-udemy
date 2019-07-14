const jwt = require('jsonwebtoken');
const SEED =require('../config/config').SEED

//==================
//Verifica Token
//==================
let verificaToken = (req,res,next)=>{
    
    let token = req.query.token;    
    jwt.verify(token,SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                mensaje: 'Token incorrecto',
                 errors: err
            })
        }      

        
        
        if(!decoded.usuarioDB || !decoded.UsuarioDB){
            if(err){
                return res.status(401).json({
                    ok:false,
                    mensaje: 'Error al obtener el token',
                     errors: err
                })
            }  
        }                    

       req.usuario = decoded['usuarioDB'] ? decoded.usuarioDB : decoded.UsuarioDB;  
       console.log(req.usuario)
       
        return next();
    } )
}



//==================
//Verifica Token
//==================
let verificaADMIN_ROLE = (req,res,next)=>{
    
    let usuario = req.usuario
        
    if(usuario.role ==='ADMIN_ROLE'){
        next();
        return;
    }else{
        return res.status(401).json({
            ok:false,
            mensaje: 'Role incorrecto',
             errors: {
                 error: 'Error al realizar la operación'
             }
        })
    }     
 
}

let verificaADMIN_ROLE_o_MismoID = (req,res,next)=>{
    let usuario = req.usuario
    let id = req.params.id
    if(usuario.role ==='ADMIN_ROLE' || usuario._id ===id){
        next();
        return;
    }else{
        return res.status(401).json({
            ok:false,
            mensaje: 'Error al actualizar el perfil ',
             errors: {
                 error: 'Error al actualizar el perfil'
             }
        })
    }     
 
}

module.exports = {
    verificaToken,
    verificaADMIN_ROLE,
    verificaADMIN_ROLE_o_MismoID
} 