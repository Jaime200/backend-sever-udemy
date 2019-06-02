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
        
        if(decoded.UsuarioDB){
            if(err){
                return res.status(401).json({
                    ok:false,
                    mensaje: 'Error al obtener el token',
                     errors: err
                })
            }  
        }        
       req.usuario = decoded.usuarioDB;
        return next();
    } )
}


module.exports = {
    verificaToken
} 