const express = require('express');
const bcrypt = require('bcryptjs')
const { verificaToken, verificaADMIN_ROLE,verificaADMIN_ROLE_o_MismoID } = require('../middlewares/autenticacion')
let app = express();
let Usuario  =  require('../models/usuario')

//rutas

/*Obtener todos los usuarios */
app.get('/', [verificaToken,verificaADMIN_ROLE],(req,res, next)=>{
    console.log(req.query)
    let desde = req.query.desde || 0;
    desde = Number(desde);
    console.log(desde)
    Usuario.find({}
        ,'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
         (err, usuariosDB)=>{
        if(err){
            return  res.status(500).json({
                ok:false,
                message: 'Error al cargar usuarios',
                errors: err
            })
        }
        Usuario.count({},(err, conteo )=>{
            return res.status(200).json({
                ok: true,
                total : conteo,
                usuarios: usuariosDB
            })
        })
        

    }
    )//fin exec
    
 })


/*Actualizar un usuario */
app.put('/:id',[verificaToken,verificaADMIN_ROLE_o_MismoID],(req,res)=>{
    
    let id = req.params.id
    let token = req.query.token;
    let body = req.body
    Usuario.findById(id, (err,UsuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });            
        }

        if(!UsuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje:`El usuario con el id ${id} no existe`,
                errors: {message:'No existe un usuario con el ID'}
            }); 
        }

        UsuarioDB.nombre  = body.nombre //? body.nombre: UsuarioDB.nombre 
        UsuarioDB.email   = body.email  //?  body.email : UsuarioDB.email 
        UsuarioDB.role    = body.role   //?  body.role : UsuarioDB.role 
        

        UsuarioDB.save((err, usuarioGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar usuario',
                    errors: err
                })
            }
            usuarioGuardado.password = ':)'
            return res.status(200).json({
                ok:true,
                mensaje:'El usuario se actualizó',
                UsuarioDB: usuarioGuardado,
                token 
            })
        })

        

    })
    
})


/*Crear un nuevo usuario */
app.post('/',(req,res) => {
    let body = req.body;
    let token = req.query.token;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role : body.role
    })
    
    usuario.save((err, UsuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear usuario',
                 errors: err
            })
        }

        return res.status(201).json({
            ok: true,
            mensaje:'El usuario ha sido creado',
            UsuarioDB,
            token 
        })
    })
    

})

/*Eliminar un usuario */
app.delete('/:id',[verificaToken, verificaADMIN_ROLE,verificaADMIN_ROLE_o_MismoID],(req,res)=>{
    let id = req.params.id 
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al eliminar usuario',
                errors: err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                mensaje:`No existe un usuario con el id ${id}` ,
                errors: { message:`No existe un usuario con el id ${id}`}
            })
        }


        return res.status(200).json({
            ok:true,
            mensaje :'El usuario ha sido borrado',
            usuario: usuarioBorrado
        })
    })
})

 module.exports = app;
 