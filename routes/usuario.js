const express = require('express');
const bcrypt = require('bcryptjs')
const { verificaToken } = require('../middlewares/autenticacion')
let app = express();
let Usuario  =  require('../models/usuario')

//rutas

/*Obtener todos los usuarios */
app.get('/', (req,res, next)=>{

    Usuario.find({}
        ,'nombre email img role')
        .exec(
         (err, usuariosDB)=>{
        if(err){
            return  res.status(500).json({
                ok:false,
                message: 'Error al cargar usuarios',
                errors: err
            })
        }
    
        return res.status(200).json({
            ok: true,
            usuarios: usuariosDB
        })

    }
    )//fin exec
    
 })


/*Actualizar un usuario */
app.put('/:id',[verificaToken],(req,res)=>{
    
    let id = req.params.id
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
                usuario: usuarioGuardado
            })
        })

        

    })
    
})


/*Crear un nuevo usuario */
app.post('/',[verificaToken],(req,res) => {
    let body = req.body;
    console.log(body)
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
            usuario: UsuarioDB 
        })
    })
    

})

/*Eliminar un usuario */
app.delete('/:id',[verificaToken],(req,res)=>{
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
 