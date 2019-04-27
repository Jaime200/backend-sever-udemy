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
        req.
        console.log(decoded)
        req.usuario = decode.UsuarioBD;
        next();
    } )
}


module.exports = {
    verificaToken
} 